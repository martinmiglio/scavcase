/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.tarkov.dev" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "**.placeholder.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "static-cdn.jtvnw.net" },
    ],
  },
};

module.exports = nextConfig;
