import type { Config } from 'next'

const config: Config = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
    domains: ['localhost'],
  },
}

export default config
