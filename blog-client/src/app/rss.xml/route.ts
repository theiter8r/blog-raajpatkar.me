import { getPosts } from '@/lib/api';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';

export async function GET() {
  try {
    const { posts } = await getPosts(1, 100);

    const items = posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <pubDate>${post.published_at ? new Date(post.published_at).toUTCString() : ''}</pubDate>
    </item>`
      )
      .join('');

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

    return new Response(feed.trim(), {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    return new Response('Failed to generate RSS feed', { status: 500 });
  }
}
