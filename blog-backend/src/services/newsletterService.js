const db = require('../config/database');

const newsletterService = {
  /**
   * Create a pending log entry for a subscriber
   */
  async createLog(postId, subscriberId) {
    const result = await db.query(
      `INSERT INTO newsletter_logs (post_id, subscriber_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING id`,
      [postId, subscriberId]
    );
    return result.rows[0];
  },

  /**
   * Mark log entry as sent
   */
  async markSent(logId) {
    await db.query(
      `UPDATE newsletter_logs SET status = 'sent', sent_at = NOW() WHERE id = $1`,
      [logId]
    );
  },

  /**
   * Mark log entry as failed
   */
  async markFailed(logId, errorMessage) {
    await db.query(
      `UPDATE newsletter_logs SET status = 'failed', error_message = $2 WHERE id = $1`,
      [logId, errorMessage]
    );
  },

  /**
   * Get send stats for a post
   */
  async getStatsForPost(postId) {
    const result = await db.query(
      `SELECT status, COUNT(*) as count
       FROM newsletter_logs
       WHERE post_id = $1
       GROUP BY status`,
      [postId]
    );

    const stats = { pending: 0, sent: 0, failed: 0 };
    for (const row of result.rows) {
      stats[row.status] = parseInt(row.count, 10);
    }
    return stats;
  },
};

module.exports = newsletterService;
