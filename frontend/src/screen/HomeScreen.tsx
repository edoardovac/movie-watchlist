import { useState } from "react";
import { StyleSheet } from "react-native";
import { BottomNavigation } from "react-native-paper";
import FindScreen from "./FindScreen";
import WatchlistScreen from "./WatchlistScreen";
import { Movie } from "../types/Movie";

const HomeScreen = () => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [routes] = useState([
    {
      key: "find",
      title: "Find",
      focusedIcon: "magnify",
      unfocusedIcon: "magnify",
    },
    {
      key: "watchlist",
      title: "Watchlist",
      focusedIcon: "movie-open",
      unfocusedIcon: "movie-outline",
    },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "find":
        return (
          <FindScreen
            text={text}
            setText={setText}
            results={results}
            setResults={setResults}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case "watchlist":
        return <WatchlistScreen />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationEnabled
      sceneAnimationType="shifting"
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
