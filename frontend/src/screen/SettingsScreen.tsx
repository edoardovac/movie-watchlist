import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import { testBackendConnection } from "../api/system";
import LoginScreen from "./LoginScreen";
import { useSnackbar } from "../context/SnackbarContext";
import { useThemeContext } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = () => {
  const { token, logout } = useAuth();
  const { showMessage } = useSnackbar();
  const { isDark, toggleTheme } = useThemeContext();
  const [showLogin, setShowLogin] = useState(false);
  const theme = useTheme();

  const testConnection = async () => {
    try {
      const result = await testBackendConnection();
      showMessage(`Response: ${result}`);
    } catch (err) {
      showMessage("Failed to reach backend.");
    }
  };

  const resetTutorial = async () => {
    await AsyncStorage.removeItem("tutorial_seen");
    showMessage("Tutorial will show on next launch");
  };

  if (showLogin) {
    return <LoginScreen onClose={() => setShowLogin(false)} />;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Button mode="contained" onPress={testConnection}>
        Test Backend Connection
      </Button>
      <Button
        icon="theme-light-dark"
        onPress={toggleTheme}
        mode="outlined"
        style={{ marginTop: 20 }}
      >
        Switch to {isDark ? "Light" : "Dark"} Mode
      </Button>
      <Button
        icon="information-outline"
        onPress={resetTutorial}
        mode="outlined"
        style={{ marginTop: 20 }}
      >
        Show Tutorial Again
      </Button>
      {token ? (
        <Button
          mode="outlined"
          onPress={() => {
            logout();
            showMessage("Logged out successfully");
          }}
          style={styles.logoutButton}
          icon="logout"
        >
          Log Out
        </Button>
      ) : (
        <Button
          mode="outlined"
          onPress={() => setShowLogin(true)}
          style={styles.logoutButton}
          icon="login"
        >
          Log In
        </Button>
      )}
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
