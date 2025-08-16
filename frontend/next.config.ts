import type { NextConfig } from "next";
// const { PHASE_DEVELOPMENT_SERVER ,PHASE_PRODUCTION_SERVER,PHASE_PRODUCTION_BUILD,PHASE_EXPORT} = require('next/constants')

// export const PHASE_TEST = 'phase-test'
const nextConfig: NextConfig = {
  /* config options here */
  env: {
    Phase: process.env.Phase,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISH_KEY: process.env.STRIPE_PUBLISH_KEY,
  },
   allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev','http://192.168.100.14'],
   
   
};

export default nextConfig;
