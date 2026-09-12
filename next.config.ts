import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://cdn.discordapp.com/avatars/**"),
      new URL("https://cdn.discordapp.com/embed/avatars/**"),
      new URL("https://cdn.discordapp.com/assets/collectibles/**"),
      new URL("https://cdn.discordapp.com/avatar-decoration-presets/**"),
    ],
  },
};

export default nextConfig;
