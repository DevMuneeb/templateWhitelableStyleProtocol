/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/style-gpt",
        destination: "/style-gpt/dashboard",
        permanent: true,
      },
      {
        source: "/mvp",
        destination: "/mvp/dashboard",
        permanent: true,
      },
    ];
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  staticPageGenerationTimeout: 10000,
};

export default nextConfig;
