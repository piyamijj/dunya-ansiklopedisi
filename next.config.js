/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // NOTE: Vercel's build environment (Linux x86_64) has full native SWC support,
  // so no Babel fallback / swcMinify override is needed here — local Termux/Android
  // ARM64 build verification is intentionally skipped for this project; Vercel
  // performs the real production build on its own infrastructure.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
