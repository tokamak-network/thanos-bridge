/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['wagmi', '@wagmi/connectors', '@tanstack/react-query'],
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        config.resolve.alias = {
            ...config.resolve.alias,
            '@react-native-async-storage/async-storage': false,
        };
        return config;
    },
}

module.exports = nextConfig
