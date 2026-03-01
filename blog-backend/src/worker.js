require('./config/env');
const { startWorker } = require('./worker/newsletterWorker');

console.log('[Worker] Starting newsletter worker process...');

const worker = startWorker();

// Graceful shutdown
async function shutdown(signal) {
  console.log(`[Worker] ${signal} received. Closing worker...`);
  await worker.close();
  console.log('[Worker] Worker closed. Exiting.');
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  console.error('[Worker] Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('[Worker] Unhandled rejection:', err);
  process.exit(1);
});
