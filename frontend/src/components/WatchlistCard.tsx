import { View, Text, StyleSheet } from "react-native";
import { useRef } from "react";
import { Watchlist } from "../types/Watchlist";
import { IconButton } from "react-native-paper";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

type Props = {
  watchlist: Watchlist;
  onDelete: (id: number, name: string) => void;
  onEdit: (watchlist: Watchlist) => void;
};

const WatchlistCard = ({ watchlist, onDelete, onEdit }: Props) => {
  const swipeableRef = useRef<SwipeableMethods | null>(null);

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
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{watchlist.name}</Text>
        {watchlist.notes && <Text style={styles.notes}>{watchlist.notes}</Text>}
      </View>
    </Swipeable>
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
