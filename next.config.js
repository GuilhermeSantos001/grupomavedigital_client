const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css')
const path = require("path");

module.exports = withCSS()

module.exports = withSass({
  /* by default config  option Read For More Options
  here https://github.com/vercel/next-plugins/tree/master/packages/next-sass*/
  cssModules: true
})

module.exports = withPWA({
  swcMinify: process.env.NODE_ENV === 'development',
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false
  },
  pwa: {
    dest: 'public',
    maximumFileSizeToCacheInBytes: 5000000, // 5MB of cache for all files (default: 2000000 // 2MB)
    disable: process.env.NODE_ENV === 'development',
    register: true,
    runtimeCaching,
  },
})