import { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  FAB,
  Text,
  useTheme,
} from "react-native-paper";
import Constants from "expo-constants";
import { Watchlist } from "../types/Watchlist";
import WatchlistCard from "../components/WatchlistCard";
import {
  createWatchlist,
  deleteWatchlists,
  fetchWatchlists,
  updateWatchlists,
} from "../api/watchlists";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "./LoginScreen";
import { Movie } from "../types/Movie";
import { getMoviesInWatchlist } from "../api/movies";
import WatchlistMoviesScreen from "./WatchlistMovieScreen";
import { getToken } from "../utils/tokenStorage";
import { getUserInfo } from "../api/login";
import { useSnackbar } from "../context/SnackbarContext";
import WatchlistModal from "../components/WatchlistModal";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const WatchlistScreen = () => {
  const { token } = useAuth();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [lists, setLists] = useState<Watchlist[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");
  const [editingWatchlist, setEditingWatchlist] = useState<Watchlist | null>(
    null
  );
  const [editName, setEditName] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [moviesByList, setMoviesByList] = useState<Record<number, Movie[]>>({});
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(
    null
  );
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const { showMessage } = useSnackbar();
  const theme = useTheme();

  const openDialog = () => setVisible(true);
  const closeDialog = () => {
    setVisible(false);
    setName("");
    setNotes("");
  };

  useEffect(() => {
    if (token) {
      loadWatchlists();
      fetchUsername();
    }
  }, [token]);

  const handleCreateWatchlist = async () => {
    console.log(`${API_URL}/watchlists`);
    console.log(JSON.stringify({ name, notes }));
    try {
      if (!token) throw new Error("No token available");
      if (!name.trim()) {
        throw new Error("Name is missing");
      }

      const data = await createWatchlist(token, name, notes);

      console.log("Created watchlsit", data);
      showMessage("Watchlist created");

      closeDialog();
      loadWatchlists();
    } catch (err) {
      console.log("Error:", err);
      showMessage("Failed to create watchlist");
      closeDialog();
    }
  };

  const loadWatchlists = async () => {
    try {
      if (!token) throw new Error("No token available");
      const data = await fetchWatchlists(token);

      setLists(data);
      console.log("Fetched watchlsit", data);
      //showMessage("Watchlists refreshed");
    } catch (err) {
      console.log("Error:", err);
      showMessage("Failed to load watchlists");
    }
  };

  const handleRefresh = async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const data = await fetchWatchlists(token);
      setLists(data);
    } catch (err) {
      console.log("Refresh error", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!token || confirmDeleteId === null) return;
    try {
      await deleteWatchlists(token, confirmDeleteId);
      console.log("deleted watchlist", confirmDeleteId);
      showMessage("Watchlist deleted");
      setConfirmDeleteId(null);
      setConfirmDeleteName("");
      loadWatchlists();
    } catch (err) {
      console.log("Delete error:", err);
      showMessage("Failed to delete watchlist");
    }
  };

  const fetchUsername = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const user = await getUserInfo(token);
      setUsername(user.username);
    } catch (err) {
      console.error("Error fetching username", err);
    }
  };

  const openWatchlist = async (watchlist: Watchlist) => {
    try {
      const movies = await getMoviesInWatchlist(token!, watchlist.watchlist_id);
      setSelectedWatchlist(watchlist);
      setSelectedMovies(movies);
    } catch (err) {
      console.error("Failed to open watchlist", err);
    }
  };

  const handleUpdateWatchlist = async () => {
    if (!token || !editingWatchlist) return;
    try {
      await updateWatchlists(
        token,
        editingWatchlist.watchlist_id,
        editName,
        editNotes
      );
      showMessage("Watchlist updated");
      setEditingWatchlist(null);
      loadWatchlists();
    } catch (err) {
      console.log("Error updating:", err);
      showMessage("Failed to update watchlist");
    }
  };

  const handleEdit = async (watchlist: Watchlist) => {
    setEditingWatchlist(watchlist);
    setEditName(watchlist.name);
    setEditNotes(watchlist.notes || "");
  };

  if (showLogin) {
    return <LoginScreen onClose={() => setShowLogin(false)} />;
  }

  if (!token) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            color: theme.colors.onBackground,
          }}
        >
          Please log in to view your saved watchlists.
        </Text>
        <Button mode="contained" onPress={() => setShowLogin(true)}>
          Login
        </Button>
      </View>
    );
  }

  if (selectedWatchlist) {
    return (
      <WatchlistMoviesScreen
        watchlist={selectedWatchlist}
        movies={selectedMovies}
        onClose={() => setSelectedWatchlist(null)}
      />
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.username}>
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onBackground }}
        >{`${username}'s Watchlists`}</Text>
      </View>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.watchlist_id.toString()}
        renderItem={({ item }) => (
          <>
            <WatchlistCard
              watchlist={item}
              onPress={() => openWatchlist(item)}
              onDelete={(id, name) => {
                setConfirmDeleteId(id);
                setConfirmDeleteName(name);
              }}
              onEdit={handleEdit}
            />
            {expandedId === item.watchlist_id && (
              <FlatList
                data={moviesByList[item.watchlist_id] || []}
                keyExtractor={(movie) =>
                  movie.movie_id?.toString() || movie.tmdb_id.toString()
                }
                renderItem={({ item: movie }) => (
                  <View
                    style={[
                      styles.expandedMovie,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.outline,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.movieTitle,
                        { color: theme.colors.onBackground },
                      ]}
                    >
                      {movie.title}
                    </Text>
                    {movie.watched && (
                      <Text
                        style={[
                          styles.watched,
                          { color: theme.colors.primary },
                        ]}
                      >
                        ✔ Watched
                      </Text>
                    )}
                  </View>
                )}
                scrollEnabled={false}
              />
            )}
          </>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      <FAB icon="plus" style={styles.fab} onPress={openDialog} />
      {visible && !editingWatchlist && (
        <WatchlistModal
          visible={visible}
          onDismiss={closeDialog}
          onSubmit={handleCreateWatchlist}
          name={name}
          notes={notes}
          setName={setName}
          setNotes={setNotes}
        />
      )}
      {!!editingWatchlist && (
        <WatchlistModal
          visible={!!editingWatchlist}
          onDismiss={() => setEditingWatchlist(null)}
          onSubmit={handleUpdateWatchlist}
          name={editName}
          notes={editNotes}
          setName={setEditName}
          setNotes={setEditNotes}
          title="Edit Watchlist"
          submitLabel="Save"
        />
      )}
      <Portal>
        <Dialog
          visible={confirmDeleteId !== null}
          onDismiss={() => setConfirmDeleteId(null)}
        >
          <Dialog.Title>Delete Watchlist</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to delete "
              <Text style={{ fontWeight: "bold" }}>{confirmDeleteName}</Text>"?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDeleteId(null)}>Cancel</Button>
            <Button onPress={handleDeleteConfirmed}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default WatchlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  button: {
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  expandedMovie: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  movieTitle: {
    fontSize: 16,
  },
  watched: {
    fontSize: 12,
  },
  username: {
    justifyContent: "center",
    alignItems: "center",
  },
});
