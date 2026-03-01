const env = require('../config/env');

/**
 * Generate newsletter HTML email
 */
function buildNewsletterEmail({ title, excerpt, slug, unsubscribeToken }) {
  const postUrl = `${env.APP_URL}/posts/${slug}`;
  const unsubscribeUrl = `${env.APP_URL}/unsubscribe/${unsubscribeToken}`;
  const previewText = excerpt || `New post: ${title}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .email-wrapper {
      width: 100%;
      background-color: #f4f4f7;
      padding: 40px 0;
    }
    .email-content {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
    .email-header {
      background-color: #1a1a2e;
      color: #ffffff;
      padding: 32px 40px;
      text-align: center;
    }
    .email-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .email-body {
      padding: 40px;
    }
    .email-body h1 {
      margin: 0 0 16px 0;
      font-size: 26px;
      font-weight: 700;
      color: #1a1a2e;
      line-height: 1.3;
    }
    .email-body .preview-text {
      color: #6b7280;
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 28px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #3b82f6;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 8px;
    }
    .cta-button:hover {
      background-color: #2563eb;
    }
    .email-footer {
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .email-footer p {
      margin: 0;
      font-size: 13px;
      color: #9ca3af;
      line-height: 1.5;
    }
    .email-footer a {
      color: #6b7280;
      text-decoration: underline;
    }

    /* Hidden preview text */
    .preview-spacer {
      display: none;
      font-size: 1px;
      color: #f4f4f7;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <span class="preview-spacer">${previewText}</span>

  <div class="email-wrapper">
    <div class="email-content">
      <div class="email-header">
        <h2>${env.BLOG_NAME}</h2>
      </div>

      <div class="email-body">
        <h1>${title}</h1>
        <p class="preview-text">${previewText}</p>
        <a href="${postUrl}" class="cta-button">Read More &rarr;</a>
      </div>

      <div class="email-footer">
        <p>
          You received this because you subscribed to ${env.BLOG_NAME}.<br>
          <a href="${unsubscribeUrl}">Unsubscribe</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate confirmation email HTML
 */
function buildConfirmationEmail({ confirmUrl }) {
  const previewText = `Confirm your subscription to ${env.BLOG_NAME}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your subscription</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .email-wrapper { width: 100%; background-color: #f4f4f7; padding: 40px 0; }
    .email-content { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .email-header { background-color: #1a1a2e; color: #ffffff; padding: 32px 40px; text-align: center; }
    .email-header h2 { margin: 0; font-size: 18px; font-weight: 600; }
    .email-body { padding: 40px; }
    .email-body h1 { margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #1a1a2e; }
    .email-body p { color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; }
    .cta-button { display: inline-block; background-color: #3b82f6; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600; }
    .email-footer { padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
    .email-footer p { margin: 0; font-size: 13px; color: #9ca3af; }
    .preview-spacer { display: none; font-size: 1px; color: #f4f4f7; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; }
  </style>
</head>
<body>
  <span class="preview-spacer">${previewText}</span>
  <div class="email-wrapper">
    <div class="email-content">
      <div class="email-header">
        <h2>${env.BLOG_NAME}</h2>
      </div>
      <div class="email-body">
        <h1>Confirm your subscription</h1>
        <p>Thanks for subscribing! Click the button below to confirm your email address and start receiving new posts.</p>
        <a href="${confirmUrl}" class="cta-button">Confirm Subscription &rarr;</a>
        <p style="margin-top: 24px; font-size: 14px;">If you didn't subscribe, you can safely ignore this email.</p>
      </div>
      <div class="email-footer">
        <p>You received this from ${env.BLOG_NAME}.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

module.exports = { buildNewsletterEmail, buildConfirmationEmail };
