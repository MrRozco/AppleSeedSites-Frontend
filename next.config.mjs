/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    compress: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        domains: ['localhost', '127.0.0.1', 'incredible-friendship-84da35b266.strapiapp.com', 'incredible-friendship-84da35b266.media.strapiapp.com']
    }
};

export default nextConfig;
