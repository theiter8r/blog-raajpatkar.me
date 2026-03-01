const crypto = require('crypto');
const db = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

const subscriberService = {
  /**
   * Subscribe a new email (unverified)
   */
  async subscribe(email) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await db.query(
      'SELECT id, confirmed FROM subscribers WHERE email = $1',
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].confirmed) {
        throw new AppError('Email is already subscribed', 409);
      }
      // Return existing record with token for re-sending confirmation
      const result = await db.query(
        'SELECT id, email, confirmation_token FROM subscribers WHERE email = $1',
        [normalizedEmail]
      );
      return { subscriber: result.rows[0], isNew: false };
    }

    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    const result = await db.query(
      `INSERT INTO subscribers (email, confirmation_token, unsubscribe_token)
       VALUES ($1, $2, $3)
       RETURNING id, email, confirmation_token`,
      [normalizedEmail, confirmationToken, unsubscribeToken]
    );

    return { subscriber: result.rows[0], isNew: true };
  },

  /**
   * Confirm a subscriber by token
   */
  async confirm(token) {
    const result = await db.query(
      `UPDATE subscribers
       SET confirmed = TRUE, confirmed_at = NOW()
       WHERE confirmation_token = $1 AND confirmed = FALSE
       RETURNING id, email`,
      [token]
    );

    if (result.rows.length === 0) {
      // Check if already confirmed
      const existing = await db.query(
        'SELECT confirmed FROM subscribers WHERE confirmation_token = $1',
        [token]
      );
      if (existing.rows.length > 0 && existing.rows[0].confirmed) {
        throw new AppError('Email is already confirmed', 400);
      }
      throw new AppError('Invalid confirmation token', 404);
    }

    return result.rows[0];
  },

  /**
   * Unsubscribe by token
   */
  async unsubscribe(token) {
    const result = await db.query(
      'DELETE FROM subscribers WHERE unsubscribe_token = $1 RETURNING id, email',
      [token]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid unsubscribe token', 404);
    }

    return result.rows[0];
  },

  /**
   * Get confirmed subscribers in batches
   */
  async getConfirmedBatch(offset, limit = 500) {
    const result = await db.query(
      `SELECT id, email, unsubscribe_token
       FROM subscribers
       WHERE confirmed = TRUE
       ORDER BY id
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  /**
   * Count confirmed subscribers
   */
  async countConfirmed() {
    const result = await db.query(
      'SELECT COUNT(*) FROM subscribers WHERE confirmed = TRUE'
    );
    return parseInt(result.rows[0].count, 10);
  },
};

module.exports = subscriberService;
