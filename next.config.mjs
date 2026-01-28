/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Ensure /tasks (no trailing segment) proxies correctly
      {
        source: "/tasks",
        destination: "https://mina-tasks.vercel.app/tasks",
      },
      {
        source: "/tasks/:path*",
        destination: "https://mina-tasks.vercel.app/tasks/:path*",
      },
    ];
  },
};

export default nextConfig;
