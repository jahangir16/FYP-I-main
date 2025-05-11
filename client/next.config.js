/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "randomuser.me", "sjc.microlink.io"], // Add the new hostname here
  },
  experimental: {
    reactRoot: true,
    suppressHydrationWarning: true,
  },
};

module.exports = nextConfig;
