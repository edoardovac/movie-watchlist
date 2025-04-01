import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dialog, Portal, Button, Text } from "react-native-paper";
import PagerView from "react-native-pager-view";

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

const pages = [
  {
    title: "Welcome!",
    content:
      "This app helps you discover movies and organize them into watchlists.",
  },
  {
    title: "Search",
    content: "Use the 'Find' tab to search for movies and view detailed info.",
  },
  {
    title: "Watchlists",
    content: "Create custom watchlists and save your favorite movies.",
  },
  {
    title: "Track Progress",
    content: "Mark movies as watched and sort by different filters.",
  },
];

const WelcomeDialog = ({ visible, onDismiss }: Props) => {
  const [page, setPage] = useState(0);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{pages[page].title}</Dialog.Title>
        <Dialog.Content>
          <Text>{pages[page].content}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {page > 0 && (
            <Button onPress={() => setPage((p) => p - 1)}>Back</Button>
          )}
          {page < pages.length - 1 ? (
            <Button onPress={() => setPage((p) => p + 1)}>Next</Button>
          ) : (
            <Button onPress={onDismiss}>Done</Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default WelcomeDialog;
