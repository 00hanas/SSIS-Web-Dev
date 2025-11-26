/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ]
  },
  images: {
    domains: ["liofppzunluhdsrbwogc.supabase.co"],
  },
}

module.exports = nextConfig
