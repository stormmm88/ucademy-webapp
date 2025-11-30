import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hgt1jk6ja5.ufs.sh",
        port: "",
        pathname: "/f/**",
      },  
    ],
  },
};

export default nextConfig;
