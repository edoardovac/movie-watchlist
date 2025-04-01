import { View, StyleSheet } from "react-native";
import {
  ActivityIndicator,
  Button,
  TextInput,
  Text,
  useTheme,
} from "react-native-paper";
import { searchMovies, getMovieDetails } from "../api/tmdb";
import { FlatList } from "react-native-gesture-handler";
import MovieCard from "../components/MovieCard";
import { Movie } from "../types/Movie";
import { useState } from "react";
import { Watchlist } from "../types/Watchlist";
import { fetchWatchlists as getWatchlists } from "../api/watchlists";
import { useAuth } from "../context/AuthContext";
import { addMovieToWatchlist } from "../api/movies";
import AddToWatchlistDialog from "../components/AddToWatchlistDialog";
import { useSnackbar } from "../context/SnackbarContext";

type Props = {
  text: string;
  setText: (value: string) => void;
  results: Movie[];
  setResults: (movies: Movie[]) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
};

const FindScreen = ({
  text,
  setText,
  results,
  setResults,
  loading,
  setLoading,
}: Props) => {
  const { token } = useAuth();
  const { showMessage } = useSnackbar();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const theme = useTheme();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const basicResults = await searchMovies(text);

      // details for first 5 movies
      const detailedResults = await Promise.all(
        basicResults.slice(0, 5).map(async (movie: any) => {
          const details = await getMovieDetails(movie.id);
          return {
            ...movie,
            overview: details?.overview,
            tagline: details?.tagline,
            runtime: details?.runtime,
          };
        })
      );
      setResults(detailedResults);
    } catch (err) {
      console.error(err);
      showMessage("Failed to load your watchlists.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlists = async () => {
    try {
      if (!token) throw new Error("No token available");
      const data = await getWatchlists(token);

      setWatchlists(data);
      console.log("Fetched watchlsit", data);
    } catch (err) {
      console.log("Error:", err);
      showMessage("Failed to load your watchlists.");
    }
  };

  const handleAddMovie = async (watchlistId: number) => {
    if (!token || !selectedMovie) return;

    try {
      await addMovieToWatchlist(token, watchlistId, selectedMovie);
      setDialogVisible(false);
      setSelectedMovie(null);
    } catch (err) {
      console.error("Failed to add movie to watchlsit", err);
      showMessage("Failed to add movie to watchlist.");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TextInput
        label="Search Movie Title"
        value={text}
        onChangeText={(text) => setText(text)}
        style={styles.input}
        contentStyle={{ textAlign: "center" }}
        right={
          text.length > 0 ? (
            <TextInput.Icon icon="close" onPress={() => setText("")} />
          ) : null
        }
      />
      <Button icon="movie-roll" mode="contained" onPress={handleSearch}>
        Search on TMDB
      </Button>
      {results.length > 0 && (
        <Button onPress={() => setResults([])} style={{ marginTop: 10 }}>
          Clear Results
        </Button>
      )}
      {!loading && results.length === 0 && text.length > 0 && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No results found.
        </Text>
      )}
      {loading && (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onAddToWatchlist={(movie) => {
              setSelectedMovie(movie);
              setDialogVisible(true);
              fetchWatchlists();
            }}
          />
        )}
      />
      <AddToWatchlistDialog
        visible={dialogVisible}
        onDismiss={() => {
          setDialogVisible(false);
          setSelectedMovie(null);
        }}
        watchlists={watchlists}
        selectedMovie={selectedMovie}
        onSelectWatchlist={handleAddMovie}
      />
    </View>
  );
};

export default FindScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    marginBottom: 5,
  },
  text: {
    marginTop: 10,
  },
  spinner: {
    marginVertical: 20,
    alignItems: "center",
  },
  noResultText: {
    textAlign: "center",
    marginTop: 20,
  },
});
