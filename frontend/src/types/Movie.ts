export type Movie = {
  id: number;
  title: string;
  releaseDate?: string;
  posterPath?: string;
  voteAverage?: number;
  overview?: string;
  runtime?: number;
  tagline?: string;
  [key: string]: any;
};
