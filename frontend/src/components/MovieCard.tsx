import React, { useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Text, IconButton, useTheme } from "react-native-paper";
import { Movie } from "../types/Movie";
import Constants from "expo-constants";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

const TMDB_IMAGE_BASE_URL = Constants.expoConfig?.extra?.tmdbImageBaseUrl;

type Props = {
  movie: Movie;
  onAddToWatchlist?: (movie: Movie) => void;
  swipeable?: boolean;
  onDelete?: (movie: Movie) => void;
  onToggleWatched?: (movie: Movie) => void;
};

const MovieCard = ({
  movie,
  onAddToWatchlist,
  swipeable = false,
  onDelete,
  onToggleWatched,
}: Props) => {
  const {
    title,
    poster_path,
    release_date,
    vote_average,
    overview,
    runtime,
    tagline,
  } = movie;
  const [expanded, setExpanded] = useState(false);
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const theme = useTheme();

  const handleDeletePress = () => {
    swipeableRef.current?.close();
    if (onDelete) onDelete(movie);
  };

  const content = (
    <TouchableWithoutFeedback onPress={() => setExpanded(!expanded)}>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        {poster_path ? (
          <Image
            source={{ uri: `${TMDB_IMAGE_BASE_URL}${poster_path}` }}
            style={styles.poster}
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              { backgroundColor: theme.colors.backdrop },
            ]}
          />
        )}
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {title}{" "}
            {release_date && (
              <Text style={[styles.year, { color: theme.colors.onSurface }]}>
                ({release_date.slice(0, 4)})
              </Text>
            )}
          </Text>
          <View style={styles.metaRow}>
            {runtime !== undefined && (
              <Text style={[styles.meta, { color: theme.colors.onSurface }]}>
                ⏱️ {runtime} min
              </Text>
            )}
            {vote_average !== undefined && (
              <Text style={[styles.meta, { color: theme.colors.onSurface }]}>
                ⭐ {vote_average}/10
              </Text>
            )}
          </View>
          {tagline && (
            <Text style={[styles.tagline, { color: theme.colors.onSurface }]}>
              “{tagline}”
            </Text>
          )}

          {expanded && overview && (
            <Text style={[styles.overview, { color: theme.colors.onSurface }]}>
              {overview}
            </Text>
          )}
          {onAddToWatchlist && (
            <Button
              icon="plus"
              mode="outlined"
              onPress={() => onAddToWatchlist(movie)}
              style={{ marginTop: 8 }}
            >
              Add to Watchlist
            </Button>
          )}
          {onToggleWatched && (
            <Button
              icon={movie.watched ? "check-circle" : "eye"}
              mode="text"
              onPress={() => onToggleWatched(movie)}
              style={{ marginTop: 4 }}
            >
              {movie.watched ? "Watched" : "Mark as Watched"}
            </Button>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  if (!swipeable) return content;

  const renderRightActions = () => (
    <View style={styles.rightAction}>
      <IconButton
        icon="delete"
        size={24}
        iconColor="white"
        onPress={handleDeletePress}
      />
    </View>
  );

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions}>
      {content}
    </Swipeable>
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
  rightAction: {
    backgroundColor: "#e53935",
    justifyContent: "center",
    alignItems: "center",
    width: 72,
    marginVertical: 8,
    borderRadius: 10,
  },
  year: {
    fontSize: 16,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },

  meta: {
    fontSize: 14,
    //color: "#444",
    marginRight: 10,
  },
});
