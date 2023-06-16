/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/form-builder-studio'
}

const withFonts = require('next-fonts');
module.exports = withFonts();

module.exports = nextConfig
