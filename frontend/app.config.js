import "dotenv/config";
export default {
  expo: {
    name: "frontend",
    slug: "frontend",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.API_URL,
      tmdbApiUrl: process.env.TMDB_API_URL,
      tmdbApiKey: process.env.TMDB_API_KEY,
      tmdbImageBaseUrl: process.env.TMDB_IMAGE_BASE_URL,
    },
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-secure-store"],
  },
};
