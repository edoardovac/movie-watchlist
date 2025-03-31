import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Movie } from "../types/Movie";
import Constants from "expo-constants";

const TMDB_IMAGE_BASE_URL = Constants.expoConfig?.extra?.tmdbImageBaseUrl;

type Props = Pick<
  Movie,
  | "title"
  | "posterPath"
  | "releaseDate"
  | "voteAverage"
  | "overview"
  | "runtime"
  | "tagline"
>;

const MovieCard = ({
  title,
  posterPath,
  releaseDate,
  voteAverage,
  overview,
  runtime,
  tagline,
}: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => setExpanded(!expanded)}>
      <View style={styles.card}>
        {posterPath ? (
          <Image
            source={{ uri: `${TMDB_IMAGE_BASE_URL}${posterPath}` }}
            style={styles.poster}
          />
        ) : (
          <View style={styles.placeholder} />
        )}
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          {releaseDate && <Text>📅 {releaseDate.slice(0, 4)}</Text>}
          {voteAverage !== undefined && <Text>⭐ {voteAverage}/10</Text>}
          {tagline && <Text style={styles.tagline}>“{tagline}”</Text>}
          {runtime !== undefined && <Text>⏱️ {runtime} min</Text>}
          {expanded && overview && (
            <Text style={styles.overview}>{overview}</Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MovieCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  poster: {
    width: 100,
    height: 150,
  },
  placeholder: {
    width: 100,
    height: 150,
    backgroundColor: "#ccc",
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  tagline: {
    fontStyle: "italic",
    marginBottom: 4,
  },
  overview: {
    marginTop: 4,
    fontSize: 14,
  },
});
