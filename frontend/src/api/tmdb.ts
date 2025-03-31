const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "e27398a0764523bfdbabdb8282397a49";

export const searchMovies = async (query: string) => {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&api_key=${TMDB_API_KEY}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
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
