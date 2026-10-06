import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Ảnh upload từ /admin (Supabase Storage, bucket "uploads")
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  experimental: {
    // Ảnh công trình & file Profile PDF được upload qua Server Actions
    serverActions: { bodySizeLimit: "25mb" },
  },
};

export default nextConfig;
