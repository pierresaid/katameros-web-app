module.exports = {
  transpileDependencies: ["vuetify"],
  pwa: {
    name: "Katameros",
    msTileColor: "#FFC107",
    themeColor: "#FFC107",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      scope: "/",
      description: "The Coptic lectionary. Church readings for all Week Days and Feasts.",
      icons: [
        {
          src: "img/icons/logo-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "img/icons/logo-512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          purpose: "maskable",
          src: "img/icons/logo-mask-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          purpose: "maskable",
          src: "img/icons/logo-mask-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      screenshots: [
        {
          src: "img/katameros-screen-1.png",
          sizes: "586x1189",
          type: "image/png",
        },
        {
          src: "img/katameros-screen-text.png",
          sizes: "586x1189",
          type: "image/png",
        },
        {
          src: "img/katameros-screen-dark.png",
          sizes: "586x1189",
          type: "image/png",
        },
        {
          src: "img/katameros-screen-menu.png",
          sizes: "586x1189",
          type: "image/png",
        },
      ],
      categories: ["religion", "books"],
      start_url: "https://katameros.app",
    },
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon.png",
      msTileImage: "img/icons/mstile-150x150.png",
    },
  },
};
