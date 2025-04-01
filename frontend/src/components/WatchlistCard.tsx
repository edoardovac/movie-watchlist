import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useRef } from "react";
import { Watchlist } from "../types/Watchlist";
import { IconButton, useTheme, Text } from "react-native-paper";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

type Props = {
  watchlist: Watchlist;
  onPress?: () => void;
  onDelete: (id: number, name: string) => void;
  onEdit: (watchlist: Watchlist) => void;
};

const WatchlistCard = ({ watchlist, onPress, onDelete, onEdit }: Props) => {
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const theme = useTheme();

  const handleEditPress = () => {
    swipeableRef.current?.close();
    onEdit(watchlist);
  };

  const renderRightActions = () => {
    return (
      <View style={styles.rightAction}>
        <IconButton
          icon="delete"
          size={28}
          onPress={() => onDelete(watchlist.watchlist_id, watchlist.name)}
          iconColor="white"
        />
      </View>
    );
  };

  const renderLeftActions = () => {
    return (
      <View style={styles.leftAction}>
        <IconButton
          icon="pencil"
          size={28}
          onPress={handleEditPress}
          iconColor="white"
        />
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        friction={2}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme.colors.elevation?.level1 || theme.colors.surface,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {watchlist.name}
          </Text>
          {watchlist.notes && (
            <Text
              style={[styles.notes, { color: theme.colors.onSurfaceVariant }]}
            >
              {watchlist.notes}
            </Text>
          )}
        </View>
      </Swipeable>
    </TouchableWithoutFeedback>
  );
};

export default WatchlistCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notes: {
    marginTop: 4,
    fontStyle: "italic",
    color: "#666",
  },
  rightAction: {
    backgroundColor: "#e53935",
    justifyContent: "center",
    alignItems: "center",
    width: 72,
    marginVertical: 8,
    borderRadius: 10,
  },
  leftAction: {
    backgroundColor: "#1976D2",
    justifyContent: "center",
    alignItems: "center",
    width: 72,
    marginVertical: 8,
    borderRadius: 10,
  },
});
