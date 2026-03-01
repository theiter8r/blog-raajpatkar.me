const { Queue } = require('bullmq');
const { createRedisConnection } = require('../config/redis');

const QUEUE_NAME = 'newsletter';

const newsletterQueue = new Queue(QUEUE_NAME, {
  connection: createRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },
});

/**
 * Add a newsletter send job when a post is published
 */
async function addNewsletterJob(post) {
  const job = await newsletterQueue.add('send-newsletter', {
    postId: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    htmlContent: post.html_content,
    publishedAt: post.published_at,
  });

  console.log(`Newsletter job queued: ${job.id} for post "${post.title}"`);
  return job;
}

module.exports = { newsletterQueue, addNewsletterJob, QUEUE_NAME };
