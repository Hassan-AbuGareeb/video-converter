/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
        port: "",
        pathname:
          "/kirby/images/c/c6/Kirby_RtDDX.png/revision/latest/scale-to-width-down/**",
      },
    ],
  },
};

module.exports = nextConfig;
