import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import Constants from "expo-constants";
import { useAuth } from "../context/AuthContext";
import { testBackendConnection } from "../api/system";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const SettingsScreen = () => {
  const { logout } = useAuth();
  const [message, setMessage] = useState("");

  const testConnection = async () => {
    try {
      const result = await testBackendConnection();
      setMessage(result);
    } catch (err) {
      setMessage("Failed to reach backend.");
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={testConnection}>
        Test Backend Connection
      </Button>
      {message.length > 0 && (
        <Text style={styles.result}>Response: {message}</Text>
      )}
      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
      >
        Test Backend Connection
      </Button>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  result: {
    marginTop: 20,
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 40,
  },
});
