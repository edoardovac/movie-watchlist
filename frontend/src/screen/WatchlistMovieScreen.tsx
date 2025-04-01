import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { ActivityIndicator, IconButton, Text } from "react-native-paper";
import { Watchlist } from "../types/Watchlist";
import { Movie } from "../types/Movie";
import {
  getMoviesInWatchlist,
  markMovieUnwatched,
  markMovieWatched,
  removeMovieFromWatchilist,
} from "../api/movies";
import { useAuth } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";
import MovieFilter from "../components/MovieFilter";
import { SortOption } from "../types/SortOption";
import { useSnackbar } from "../context/SnackbarContext";
import { useTheme } from "react-native-paper";

type Props = {
  watchlist: Watchlist;
  movies: Movie[];
  onClose: () => void;
};

const WatchlistMoviesScreen = ({ watchlist, onClose }: Props) => {
  const { token } = useAuth();
  const { showMessage } = useSnackbar();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("addedNewest");
  const [filterVisible, setFilterVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        if (!token) return;
        const data = await getMoviesInWatchlist(token, watchlist.watchlist_id);
        setMovies(data);
      } catch (err) {
        console.error("Failed to fetch watchlist movies", err);
        showMessage("Failed to fetch watchlist movies");
      }
    };
    fetchMovies();
  }, [token]);

  const fetchMovies = async () => {
    try {
      if (!token) return;
      setLoading(true);
      const data = await getMoviesInWatchlist(token, watchlist.watchlist_id);
      setMovies(data);
    } catch (err) {
      console.error("Failed to fetch watchlist movies", err);
      showMessage("Failed to fetch watchlist movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [token]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchMovies();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (movie: Movie) => {
    try {
      await removeMovieFromWatchilist(
        token!,
        watchlist.watchlist_id,
        movie.movie_id!
      );
      setMovies((prev) => prev.filter((m) => m.movie_id !== movie.movie_id));
      showMessage("Movie removed from watchlist");
    } catch (err) {
      console.error("Failed to remove movie:", err);
      showMessage("Failed to remove movie");
    }
  };

  const handleToggleWatched = async (movie: Movie) => {
    try {
      const isWatched = movie.watched;
      if (isWatched) {
        await markMovieUnwatched(
          token!,
          watchlist.watchlist_id,
          movie.movie_id!
        );
      } else {
        await markMovieWatched(token!, watchlist.watchlist_id, movie.movie_id!);
      }

      setMovies((prev) =>
        prev.map((m) =>
          m.movie_id === movie.movie_id ? { ...m, watched: !isWatched } : m
        )
      );
      showMessage(`Marked as ${isWatched ? "unwatched" : "watched"}`);
    } catch (err) {
      console.error("Failed to toggle watched state:", err);
      showMessage("Failed to update movie status");
    }
  };

  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy) {
      case "addedNewest":
        return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
      case "addedOldest":
        return new Date(a.added_at).getTime() - new Date(b.added_at).getTime();
      case "titleAsc":
        return a.title.localeCompare(b.title);
      case "titleDesc":
        return b.title.localeCompare(a.title);
      case "yearAsc":
        return (
          new Date(a.release_date).getFullYear() -
          new Date(b.release_date).getFullYear()
        );
      case "yearDesc":
        return (
          new Date(b.release_date).getFullYear() -
          new Date(a.release_date).getFullYear()
        );
      case "rating":
        return (b.vote_average ?? 0) - (a.vote_average ?? 0);
      case "runtimeAsc":
        return (a.runtime ?? 0) - (b.runtime ?? 0);
      case "runtimeDesc":
        return (b.runtime ?? 0) - (a.runtime ?? 0);
      default:
        return 0;
    }
  });

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={onClose} />
        <Text
          variant="titleLarge"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          {watchlist.name}
        </Text>
        <IconButton icon="sort" onPress={() => setFilterVisible(true)} />
      </View>
      <MovieFilter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        selected={sortBy}
        onSelect={setSortBy}
      />
      {loading && movies.length === 0 && (
        <View>
          <ActivityIndicator size="large" />
        </View>
      )}
      <FlatList
        data={sortedMovies}
        keyExtractor={(item) =>
          item.movie_id?.toString() || item.tmdb_id.toString()
        }
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            swipeable
            onDelete={handleDelete}
            onToggleWatched={handleToggleWatched}
          />
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          !loading ? (
            <View>
              <Text
                style={[
                  styles.emptyMessage,
                  { color: theme.colors.onBackground },
                ]}
              >
                No movies in this watchlist.
              </Text>
              <Text
                style={[
                  styles.emptyMessage,
                  { color: theme.colors.onBackground },
                ]}
              >
                To add a movie, use the "FIND" section below.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default WatchlistMoviesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
});
