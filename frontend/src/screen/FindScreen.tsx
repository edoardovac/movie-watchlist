import { View, StyleSheet, Text } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { searchMovies, getMovieDetails } from "../api/tmdb";
import { FlatList } from "react-native-gesture-handler";
import MovieCard from "../components/MovieCard";
import { Movie } from "../types/Movie";

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
            title={item.title}
            posterPath={item.poster_path}
            releaseDate={item.release_date}
            voteAverage={item.vote_average}
            overview={item.overview}
            runtime={item.runtime}
            tagline={item.tagline}
          />
        )}
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
