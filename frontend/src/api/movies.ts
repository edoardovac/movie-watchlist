import Constants from "expo-constants";
import { Movie } from "../types/Movie";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export const addMovieToWatchlist = async (
  token: string,
  watchlistId: number,
  movie: Movie
) => {
  const response = await fetch(`${API_URL}/watchlists/${watchlistId}/movies`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tmdb_id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      runtime: movie.runtime,
      tagline: movie.tagline,
      vote_average: movie.vote_average,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to add movie");
  }

  return response.json();
};

export const getMoviesInWatchlist = async (
  token: string,
  watchlistId: number
) => {
  const response = await fetch(`${API_URL}/watchlists/${watchlistId}/movies`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies in watchlist");
  }

  return await response.json();
};

export const removeMovieFromWatchilist = async (
  token: string,
  watchlistId: number,
  movieId: number
) => {
  const response = await fetch(
    `${API_URL}/watchlists/${watchlistId}/movies/${movieId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove movie from watchlist");
  }
  return await response.json();
};

export const markMovieWatched = async (
  token: string,
  watchlistId: number,
  movieId: number
) => {
  const response = await fetch(
    `${API_URL}/watchlists/${watchlistId}/movies/${movieId}/watched`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to mark as watched");
  return await response.json();
};

export const markMovieUnwatched = async (
  token: string,
  watchlistId: number,
  movieId: number
) => {
  const res = await fetch(
    `${API_URL}/watchlists/${watchlistId}/movies/${movieId}/unwatched`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to mark as unwatched");
  return await res.json();
};
