import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { getToken } from "../utils/tokenStorage";

const API_URL = "http://192.168.213.118:3000";

const WatchlistScreen = () => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const openDialog = () => setVisible(true);
  const closeDialog = () => {
    setVisible(false);
    setName("");
    setNotes("");
  };

  const handleCreateWatchlist = async () => {
    try {
      const token = getToken();

      const res = await fetch(`${API_URL}/watchlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, notes }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create watchlist");

      console.log("Created watchlsit", data);
      closeDialog();
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Watchlist Screen</Text>
      <Button mode="contained" onPress={openDialog} style={styles.button}>
        New watchlist
      </Button>
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
      </Portal>
    </View>
  );
};

export default WatchlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 20,
  },
});
