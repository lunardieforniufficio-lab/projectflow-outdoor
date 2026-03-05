import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const n8nUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ?? "https://n8n.quarrataweb.it/webhook";
    return [
      {
        source: "/api/n8n/:path*",
        destination: `${n8nUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
