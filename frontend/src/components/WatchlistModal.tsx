import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import {
  Surface,
  TextInput,
  Button,
  Text,
  useTheme,
  HelperText,
} from "react-native-paper";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: () => void;
  name: string;
  notes: string;
  setName: (text: string) => void;
  setNotes: (text: string) => void;
  title?: string;
  submitLabel?: string;
};

const WatchlistModal = ({
  visible,
  onDismiss,
  onSubmit,
  name,
  notes,
  setName,
  setNotes,
  title = "Create Watchlist",
  submitLabel = "Create",
}: Props) => {
  const theme = useTheme();

  const nameError = name.trim().length === 0;

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      style={styles.overlay}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Surface
        style={[styles.modal, { backgroundColor: theme.colors.surface }]}
      >
        <Text variant="titleMedium" style={{ marginBottom: 12 }}>
          {title}
        </Text>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <HelperText type="error" visible={nameError}>
          Name is required
        </HelperText>
        <TextInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
        />
        <View style={styles.actions}>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button mode="contained" onPress={onSubmit} disabled={nameError}>
            {submitLabel}
          </Button>
        </View>
      </Surface>
    </KeyboardAvoidingView>
  );
};

export default WatchlistModal;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  modal: {
    width: "90%",
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  input: {
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },
});
