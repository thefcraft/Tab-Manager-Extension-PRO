/** @type {import('next').NextConfig} */

const nextConfig = {
    output: "export",
    distDir: "out",
    images: {
        unoptimized: true,
    },
    basePath: "",
    assetPrefix: "/",
    
    // Customize the output directory structure
    webpack: (config, { isServer }) => {
        // Modify output filenames to avoid _next
        if (!isServer) {
          config.output.filename = 'static/js/[name].[contenthash].js'
          config.output.chunkFilename = 'static/js/[name].[contenthash].js'
        
          // Modify asset output names
          config.output.assetModuleFilename = 'static/media/[name].[hash][ext]'
        }

        // Modify css output names
        if (config.module) {
          const rules = config.module.rules
            .find((rule) => typeof rule.oneOf === 'object')
            ?.oneOf;
          if (rules) {
            rules.forEach((r) => {
              if (r.use && Array.isArray(r.use)) {
                r.use.forEach((u) => {
                  if (u.options?.modules?.getLocalIdent) {
                    u.options.modules.getLocalIdent = () =>
                      `ext_${Math.random().toString(36).substr(2, 9)}`;
                  }
                });
              }
            });
          }
        }

        return config
    }
};

export default nextConfig;
