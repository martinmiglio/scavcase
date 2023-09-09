/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.tarkov.dev" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
  },
};

module.exports = nextConfig;
