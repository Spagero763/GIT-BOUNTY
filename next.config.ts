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
    // Vercel's build environment provides a read-only config object.
    // We cannot mutate it directly, so we create a new object.
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        ...(config.watchOptions.ignored || []),
        '**/.genkit/**',
    ]
    };
    return config
  },
};

export default nextConfig;
