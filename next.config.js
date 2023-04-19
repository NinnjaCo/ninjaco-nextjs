// eslint-disable-next-line @typescript-eslint/no-var-requires
const boundleAnalyzer = require('@next/bundle-analyzer')

const withBundleAnalyzer = boundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  images: {
    domains: [
      // TODO ADD S3 BUCKETs here
      'bztf3s.stackhero-network.com',
      's3-us-west-2.amazonaws.com',
      'localhost',
    ],
    minimumCacheTTL: 604800, // 3600 * 24 * 7 = 1 week
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3200/api',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'jwt_access_secret',
  },
})
