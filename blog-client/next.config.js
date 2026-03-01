/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/rss.xml',
        headers: [
          { key: 'Content-Type', value: 'application/rss+xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
