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
    },
  },
};
