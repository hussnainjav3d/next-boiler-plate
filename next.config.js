/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rules: {
    "@next/next/no-img-element": "off",
  },
};

module.exports = nextConfig;
