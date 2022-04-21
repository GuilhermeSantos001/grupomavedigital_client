const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css')
const path = require("path");

module.exports = withCSS()

module.exports = withSass({
  /* bydefault config  option Read For More Optios
  here https://github.com/vercel/next-plugins/tree/master/packages/next-sass*/
  cssModules: true
})

module.exports = withPWA({
  swcMinify: true,
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
    disable: process.env.NODE_ENV === 'development',
    register: true,
    runtimeCaching,
  },
})