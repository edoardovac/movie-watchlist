import { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Button, Dialog, Portal, TextInput, FAB } from "react-native-paper";
import { getToken } from "../utils/tokenStorage";
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

  const openDialog = () => setVisible(true);
  const closeDialog = () => {
    setVisible(false);
    setName("");
    setNotes("");
  };

  useEffect(() => {
    if (token) {
      loadWatchlists();
    }
  }, [token]);

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", fontSize: 16 }}>
          Please log in to view your saved watchlists.
        </Text>
      </View>
    );
  }

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
      closeDialog();
      loadWatchlists();
    } catch (err) {
      console.log("Error:", err);
      closeDialog();
    }
  };

  const loadWatchlists = async () => {
    try {
      if (!token) throw new Error("No token available");
      const data = await fetchWatchlists(token);

      setLists(data);
      console.log("Fetched watchlsit", data);
    } catch (err) {
      console.log("Error:", err);
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
      setConfirmDeleteId(null);
      setConfirmDeleteName("");
      loadWatchlists();
    } catch (err) {
      console.log("Delete error:", err);
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
      setEditingWatchlist(null);
      loadWatchlists();
    } catch (err) {
      console.log("Error updating:", err);
    }
  };

  const handleEdit = async (watchlist: Watchlist) => {
    setEditingWatchlist(watchlist);
    setEditName(watchlist.name);
    setEditNotes(watchlist.notes || "");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.watchlist_id.toString()}
        renderItem={({ item }) => (
          <WatchlistCard
            watchlist={item}
            onDelete={(id, name) => {
              setConfirmDeleteId(id);
              setConfirmDeleteName(name);
            }}
            onEdit={handleEdit}
          />
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      <FAB icon="plus" style={styles.fab} onPress={openDialog} />
      <Portal>
        <Dialog visible={visible} onDismiss={closeDialog}>
          <Dialog.Title>Create Watchlist</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={"Name"}
              value={name}
              onChangeText={setName}
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label={"Notes(optional)"}
              value={notes}
              onChangeText={setNotes}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button onPress={handleCreateWatchlist}>Create</Button>
          </Dialog.Actions>
        </Dialog>
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
        <Dialog
          visible={!!editingWatchlist}
          onDismiss={() => setEditingWatchlist(null)}
        >
          <Dialog.Title>Edit Watchlist</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={editName}
              onChangeText={setEditName}
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Notes (optional)"
              value={editNotes}
              onChangeText={setEditNotes}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditingWatchlist(null)}>Cancel</Button>
            <Button onPress={handleUpdateWatchlist}>Save</Button>
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
    padding: 5,
  },
  button: {
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
