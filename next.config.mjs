import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true,
  },
  reactStrictMode: true,
};

const withVanillaExtract = createVanillaExtractPlugin();
export default withVanillaExtract(nextConfig);
