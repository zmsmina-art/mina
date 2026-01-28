/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/tasks/:path*",
        destination: "https://mina-tasks.vercel.app/tasks/:path*",
      },
    ];
  },
};

export default nextConfig;
