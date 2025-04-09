/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ビルド時の型チェックを一時的に無効化
    ignoreBuildErrors: true,
  },
  eslint: {
    // ビルド時のESLintチェックを一時的に無効化
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
