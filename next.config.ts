import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    // See https://webpack.js.org/configuration/watch/#watchoptions-ignored
    config.watchOptions = config.watchOptions || {};
    config.watchOptions.ignored = [
        ...(Array.isArray(config.watchOptions.ignored) ? config.watchOptions.ignored : []),
        '**/.genkit/**',
    ]
    return config
  },
};

export default nextConfig;
