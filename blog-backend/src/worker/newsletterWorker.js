const { Worker } = require('bullmq');
const { createRedisConnection } = require('../config/redis');
const { QUEUE_NAME } = require('../queue/newsletterQueue');
const subscriberService = require('../services/subscriberService');
const newsletterService = require('../services/newsletterService');
const { buildNewsletterEmail } = require('../services/emailTemplate');
const resend = require('../config/resend');
const env = require('../config/env');

const BATCH_SIZE = 500;

/**
 * Process a newsletter send job
 */
async function processNewsletterJob(job) {
  const { postId, title, slug, excerpt } = job.data;

  console.log(`[Worker] Processing newsletter for post: "${title}" (${postId})`);

  const totalSubscribers = await subscriberService.countConfirmed();
  console.log(`[Worker] Total confirmed subscribers: ${totalSubscribers}`);

  if (totalSubscribers === 0) {
    console.log('[Worker] No confirmed subscribers. Skipping.');
    return { sent: 0, failed: 0 };
  }

  let offset = 0;
  let totalSent = 0;
  let totalFailed = 0;

  while (offset < totalSubscribers) {
    const subscribers = await subscriberService.getConfirmedBatch(offset, BATCH_SIZE);

    if (subscribers.length === 0) break;

    console.log(
      `[Worker] Processing batch: ${offset + 1} to ${offset + subscribers.length}`
    );

    for (const subscriber of subscribers) {
      const log = await newsletterService.createLog(postId, subscriber.id);

      try {
        const html = buildNewsletterEmail({
          title,
          slug,
          excerpt,
          unsubscribeToken: subscriber.unsubscribe_token,
        });

        await resend.emails.send({
          from: `${env.BLOG_NAME} <${env.FROM_EMAIL}>`,
          to: subscriber.email,
          subject: `New Post: ${title}`,
          html,
        });

        await newsletterService.markSent(log.id);
        totalSent++;
      } catch (err) {
        console.error(
          `[Worker] Failed to send to ${subscriber.email}:`,
          err.message
        );
        await newsletterService.markFailed(log.id, err.message);
        totalFailed++;
      }
    }

    offset += BATCH_SIZE;

    // Update job progress
    const progress = Math.round((offset / totalSubscribers) * 100);
    await job.updateProgress(Math.min(progress, 100));
  }

  console.log(
    `[Worker] Newsletter complete. Sent: ${totalSent}, Failed: ${totalFailed}`
  );

  return { sent: totalSent, failed: totalFailed };
}

/**
 * Start the BullMQ worker
 */
function startWorker() {
  const worker = new Worker(QUEUE_NAME, processNewsletterJob, {
    connection: createRedisConnection(),
    concurrency: 1, // Process one job at a time
    limiter: {
      max: 10,
      duration: 1000, // Max 10 emails per second
    },
  });

  worker.on('completed', (job, result) => {
    console.log(
      `[Worker] Job ${job.id} completed. Sent: ${result.sent}, Failed: ${result.failed}`
    );
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error('[Worker] Worker error:', err.message);
  });

  console.log('[Worker] Newsletter worker started. Waiting for jobs...');

  return worker;
}

module.exports = { startWorker };
