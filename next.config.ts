import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // config options
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xbjmo2iodr.ufs.sh", // Uploadthing
        port: "", 
        pathname: "/**", 
      },
      
    ],
  },
};

export default nextConfig;
