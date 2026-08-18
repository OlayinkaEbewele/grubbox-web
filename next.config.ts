import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The listing moved to /browse; keep old links working.
      { source: "/restaurants", destination: "/browse", permanent: true },
    ];
  },

  images: {
    // Mock food photography. Replace with your own CDN when menus become real.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
