import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "drive.google.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "www.dropbox.com" },
      { hostname: "dl.dropboxusercontent.com" },
    ],
  },
};

export default nextConfig;
