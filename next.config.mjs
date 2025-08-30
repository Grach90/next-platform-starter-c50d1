/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['luxerosedubai.somee.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'luxerosedubai.somee.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'luxerosedubai.somee.com',
        port: '',
        pathname: '/**',
      }
    ],
    unoptimized: true,
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",  // frontend calls
  //       destination: "http://luxerosedubai.somee.com/api/:path*", // real API
  //     },
  //   ];
  // },
};

export default nextConfig;
