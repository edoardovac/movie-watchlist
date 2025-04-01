import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  IconButton,
  HelperText,
  useTheme,
} from "react-native-paper";
import { loginUser } from "../api/login";
import { registerUser } from "../api/login";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";

type Props = {
  onClose?: () => void;
};

const LoginScreen = ({ onClose }: Props) => {
  const { login } = useAuth();
  const { showMessage } = useSnackbar();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const theme = useTheme();

  const handleSUbmit = async () => {
    setLoading(true);
    setError("");

    try {
      let token: string;
      if (registerMode) {
        await registerUser(username, password);
        showMessage("Account created successfully");
        console.log("Account created");

        token = await loginUser(username, password);
      } else {
        token = await loginUser(username, password);
      }

      login(token);
      showMessage("Welcome back!");
      console.log("Logged in with token:", token);

      setUsername("");
      setPassword("");
      onClose?.();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isPasswordStrong = (password: string) => {
    // 1 lowercase, 1 uppecase, 1 digit, 1 special symbol, min 8 chars
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return strongRegex.test(password);
  };

  const showWeakPwWarning =
    registerMode && password.length > 0 && !isPasswordStrong(password);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {onClose && (
        <IconButton
          icon="close"
          size={24}
          onPress={onClose}
          style={{ position: "absolute", top: 10, right: 10 }}
        />
      )}
      <Text
        variant="headlineSmall"
        style={[styles.title, { color: theme.colors.onBackground }]}
      >
        {registerMode ? "Create Account" : "Login"}
      </Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
      />
      <HelperText type="error" visible={showWeakPwWarning}>
        Password must be min 8 characters long and include uppercase, number and
        special character
      </HelperText>
      {error ? (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      <Button
        mode="contained"
        onPress={handleSUbmit}
        loading={loading}
        disabled={
          loading ||
          !username ||
          !password ||
          (registerMode && !isPasswordStrong(password))
        }
      >
        {registerMode ? "Sign Up" : "Login"}
      </Button>
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      <Button
        onPress={() => {
          setRegisterMode(!registerMode);
          setError("");
        }}
        style={{ marginTop: 20 }}
      >
        {registerMode
          ? "Already have an account? Log in"
          : "Don't have an account? Register"}
      </Button>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  warning: {
    color: "#d9534f",
    marginBottom: 16,
    fontSize: 13,
  },
});
