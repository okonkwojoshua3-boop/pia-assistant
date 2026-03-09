/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  webpack: (config) => {
    // Prevent canvas from being bundled (used by pdfjs in Node envs)
    config.resolve.alias.canvas = false;
    // Exclude pdfjs worker from being processed by Next.js bundler
    config.externals = config.externals || [];
    return config;
  },
};

export default nextConfig;
