const env = require('../config/env');

/* ── Helpers ─────────────────────────────────────────────── */

function calculateReadingTime(text) {
  const plain = (text || '').replace(/<[^>]*>/g, '');
  const words = plain.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ── Inline-style the rendered HTML for email clients ───── */

function styleHtmlForEmail(html) {
  if (!html) return '';

  let result = html;

  // Phase 1 – mark code blocks so we can style inline <code> separately
  result = result.replace(/<pre>\s*<code/g, '<!--CB_START--><code');

  // Phase 2 – style inline <code> (everything not inside a <pre>)
  result = result.replace(
    /<code>/g,
    '<code style="background-color:#F5F0EB;padding:2px 6px;border-radius:4px;font-family:\'JetBrains Mono\',Menlo,Monaco,Consolas,monospace;font-size:0.9em;color:#D97706;">'
  );

  // Phase 3 – restore code blocks with proper styles
  result = result.replace(
    /<!--CB_START-->/g,
    '<pre style="background-color:#F5F0EB;padding:20px;border-radius:8px;overflow-x:auto;font-size:14px;line-height:1.6;margin:24px 0;border:1px solid #E7E5E4;">'
  );

  // Headings (preserve any existing attributes)
  result = result
    .replace(/<h1([^>]*)>/g, '<h1$1 style="font-family:Georgia,\'Times New Roman\',serif;font-size:28px;font-weight:700;color:#1C1917;margin:36px 0 16px;line-height:1.2;">')
    .replace(/<h2([^>]*)>/g, '<h2$1 style="font-family:Georgia,\'Times New Roman\',serif;font-size:24px;font-weight:700;color:#1C1917;margin:32px 0 12px;padding-bottom:12px;border-bottom:1px solid #E7E5E4;line-height:1.25;">')
    .replace(/<h3([^>]*)>/g, '<h3$1 style="font-family:Georgia,\'Times New Roman\',serif;font-size:20px;font-weight:600;color:#1C1917;margin:28px 0 10px;line-height:1.3;">')
    .replace(/<h4([^>]*)>/g, '<h4$1 style="font-size:18px;font-weight:600;color:#1C1917;margin:24px 0 8px;">');

  // Paragraphs
  result = result.replace(/<p>/g, '<p style="font-size:16px;line-height:1.8;color:#1C1917;margin:0 0 20px;">');

  // Links (don't clobber links we already styled in layout)
  result = result.replace(/<a href=/g, '<a style="color:#D97706;text-decoration:underline;text-underline-offset:2px;" href=');

  // Lists
  result = result
    .replace(/<ul>/g, '<ul style="padding-left:24px;margin:0 0 20px;list-style-type:disc;">')
    .replace(/<ol>/g, '<ol style="padding-left:24px;margin:0 0 20px;list-style-type:decimal;">')
    .replace(/<li>/g, '<li style="font-size:16px;line-height:1.8;color:#1C1917;margin-bottom:6px;">');

  // Blockquotes
  result = result.replace(
    /<blockquote>/g,
    '<blockquote style="border-left:3px solid rgba(217,119,6,0.4);padding-left:20px;font-style:italic;color:#78716C;margin:24px 0;">'
  );

  // Horizontal rules
  result = result.replace(/<hr\s*\/?>/g, '<hr style="border:none;border-top:1px solid #E7E5E4;margin:32px 0;">');

  // Images
  result = result.replace(/<img /g, '<img style="max-width:100%;height:auto;border-radius:8px;margin:24px 0;display:block;" ');

  // Tables
  result = result
    .replace(/<table>/g, '<table style="width:100%;border-collapse:collapse;margin:24px 0;">')
    .replace(/<th([^>]*)>/g, '<th$1 style="text-align:left;padding:12px;font-size:14px;font-weight:600;border-bottom:2px solid #E7E5E4;color:#78716C;text-transform:uppercase;letter-spacing:0.05em;">')
    .replace(/<td([^>]*)>/g, '<td$1 style="padding:12px;border-bottom:1px solid #E7E5E4;font-size:16px;line-height:1.8;">');

  // Bold / italic / strikethrough
  result = result
    .replace(/<strong>/g, '<strong style="font-weight:600;color:#1C1917;">')
    .replace(/<del>/g, '<del style="text-decoration:line-through;color:#78716C;">');

  return result;
}

/* ── Shared brand-aligned CSS (used by both templates) ──── */

const SHARED_STYLES = `
  body, table, td, p, a, li {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  body {
    margin: 0; padding: 0; width: 100% !important;
    background-color: #FAF9F7;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  img { border: 0; outline: none; text-decoration: none; max-width: 100%; }
`;

/* ── Newsletter email (full blog content) ───────────────── */

function buildNewsletterEmail({ title, htmlContent, excerpt, slug, unsubscribeToken, publishedAt }) {
  const postUrl = `${env.APP_URL}/posts/${slug}`;
  const unsubscribeUrl = `${env.APP_URL}/unsubscribe/${unsubscribeToken}`;
  const homeUrl = env.APP_URL;
  const previewText = excerpt || `New post: ${title}`;
  const dateStr = formatDate(publishedAt || new Date().toISOString());
  const readTime = calculateReadingTime(htmlContent || '');
  const styledContent = styleHtmlForEmail(htmlContent || '');
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>${SHARED_STYLES}</style>
</head>
<body style="margin:0;padding:0;background-color:#FAF9F7;font-family:'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Preview text -->
  <div style="display:none;font-size:1px;color:#FAF9F7;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${previewText}${'&zwnj;&nbsp;'.repeat(30)}
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF9F7;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;">

          <!-- Blog name header -->
          <tr>
            <td style="text-align:center;padding:0 0 32px;">
              <a href="${homeUrl}" style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:600;color:#1C1917;text-decoration:none;letter-spacing:-0.01em;">
                ${env.BLOG_NAME}
              </a>
            </td>
          </tr>

          <!-- Post card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:12px;border:1px solid #E7E5E4;">

                <!-- Post header -->
                <tr>
                  <td style="padding:40px 40px 0;">
                    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:500;color:#1C1917;margin:0 0 16px;line-height:1.15;letter-spacing:-0.01em;">
                      ${title}
                    </h1>
                    <p style="font-family:'Poppins',sans-serif;font-size:14px;color:#78716C;margin:0 0 24px;line-height:1.5;">
                      ${dateStr}
                      <span style="color:#E7E5E4;padding:0 8px;">&middot;</span>
                      ${readTime}
                    </p>
                    <hr style="border:none;border-top:1px solid #E7E5E4;margin:0;">
                  </td>
                </tr>

                <!-- Rendered blog content -->
                <tr>
                  <td style="padding:32px 40px 40px;font-family:'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;line-height:1.8;color:#1C1917;">
                    ${styledContent}
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- CTA button -->
          <tr>
            <td style="text-align:center;padding:32px 0;">
              <a href="${postUrl}" style="display:inline-block;background-color:#D97706;color:#ffffff;font-family:'Poppins',sans-serif;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:0.01em;">
                Read on Website &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center;padding:24px 0;border-top:1px solid #E7E5E4;">
              <p style="font-family:'Poppins',sans-serif;font-size:13px;color:#78716C;margin:0 0 8px;line-height:1.5;">
                &copy; ${year} ${env.BLOG_NAME}
              </p>
              <p style="font-family:'Poppins',sans-serif;font-size:13px;color:#78716C;margin:0;line-height:1.5;">
                You received this because you subscribed.
                <a href="${unsubscribeUrl}" style="color:#78716C;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ── Confirmation email (same brand look) ───────────────── */

function buildConfirmationEmail({ confirmUrl }) {
  const previewText = `Confirm your subscription to ${env.BLOG_NAME}`;
  const homeUrl = env.APP_URL;
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Confirm your subscription</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>${SHARED_STYLES}</style>
</head>
<body style="margin:0;padding:0;background-color:#FAF9F7;font-family:'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <div style="display:none;font-size:1px;color:#FAF9F7;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${previewText}${'&zwnj;&nbsp;'.repeat(30)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF9F7;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;">

          <!-- Blog name -->
          <tr>
            <td style="text-align:center;padding:0 0 32px;">
              <a href="${homeUrl}" style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:600;color:#1C1917;text-decoration:none;">
                ${env.BLOG_NAME}
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:12px;border:1px solid #E7E5E4;">
                <tr>
                  <td style="padding:40px;">
                    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:500;color:#1C1917;margin:0 0 16px;line-height:1.2;">
                      Confirm your subscription
                    </h1>
                    <p style="font-size:16px;line-height:1.8;color:#78716C;margin:0 0 28px;">
                      Thanks for subscribing! Click the button below to confirm your email address and start receiving new posts.
                    </p>
                    <a href="${confirmUrl}" style="display:inline-block;background-color:#D97706;color:#ffffff;font-family:'Poppins',sans-serif;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">
                      Confirm Subscription &rarr;
                    </a>
                    <p style="font-size:14px;color:#A8A29E;margin:24px 0 0;line-height:1.6;">
                      If you didn&rsquo;t subscribe, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center;padding:24px 0;border-top:1px solid #E7E5E4;margin-top:24px;">
              <p style="font-family:'Poppins',sans-serif;font-size:13px;color:#78716C;margin:0;line-height:1.5;">
                &copy; ${year} ${env.BLOG_NAME}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { buildNewsletterEmail, buildConfirmationEmail };
