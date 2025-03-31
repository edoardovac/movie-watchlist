import Constants from "expo-constants";

export const TMDB_API_URL = Constants.expoConfig?.extra?.tmdbApiUrl;
export const TMDB_API_KEY = Constants.expoConfig?.extra?.tmdbApiKey;

export const searchMovies = async (query: string) => {
  try {
    const url = `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(
      query
    )}&api_key=${TMDB_API_KEY}`;
    console.log("🔍 TMDB URL:", url); // log the actual request

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDB fetch failed:", response.status, errorText);
      throw new Error("Failed to fetch movies from TMDB");
    }

    const data = await response.json();
    return data.results;
  } catch (err) {
    console.error("TMDB search error", err);
    return [];
  }
};

export const getMovieDetails = async (movieId: number) => {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`,
      {
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch movie details");

    return await response.json();
  } catch (err) {
    console.error("Movie detail fetch error:", err);
    return null;
  }
};
