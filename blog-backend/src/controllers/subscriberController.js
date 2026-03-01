const subscriberService = require('../services/subscriberService');
const resend = require('../config/resend');
const { buildConfirmationEmail } = require('../services/emailTemplate');
const env = require('../config/env');

const subscriberController = {
  /**
   * Subscribe a new email
   */
  async subscribe(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const { subscriber } = await subscriberService.subscribe(email);

      const confirmUrl = `${env.APP_URL}/confirm/${subscriber.confirmation_token}`;
      console.log(`Confirmation URL for ${email}: ${confirmUrl}`);

      // Send confirmation email via Resend
      const html = buildConfirmationEmail({ confirmUrl });
      const { error } = await resend.emails.send({
        from: `${env.BLOG_NAME} <${env.FROM_EMAIL}>`,
        to: [email],
        subject: `Confirm your subscription to ${env.BLOG_NAME}`,
        html,
      });

      if (error) {
        console.error('Resend error:', error);
        return res.status(500).json({ error: 'Failed to send confirmation email. Please try again.' });
      }

      res.status(201).json({
        message: 'Please check your email to confirm your subscription.',
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Confirm subscription
   */
  async confirm(req, res, next) {
    try {
      const { token } = req.params;
      const subscriber = await subscriberService.confirm(token);

      res.json({
        message: 'Subscription confirmed! You will now receive newsletter emails.',
        email: subscriber.email,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Unsubscribe
   */
  async unsubscribe(req, res, next) {
    try {
      const { token } = req.params;
      const subscriber = await subscriberService.unsubscribe(token);

      res.json({
        message: 'You have been unsubscribed successfully.',
        email: subscriber.email,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = subscriberController;
