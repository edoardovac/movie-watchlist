import { Dialog, Portal, Button, List, useTheme } from "react-native-paper";
import { Watchlist } from "../types/Watchlist";
import { Movie } from "../types/Movie";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  watchlists: Watchlist[];
  onSelectWatchlist: (watchlistId: number) => void;
  selectedMovie: Movie | null;
};

const AddToWatchlistDialog = ({
  visible,
  onDismiss,
  watchlists,
  onSelectWatchlist,
  selectedMovie,
}: Props) => {
  const theme = useTheme();

  if (!selectedMovie) return null;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title style={{ color: theme.colors.onBackground }}>
          Save to Watchlist
        </Dialog.Title>
        <Dialog.Content>
          {watchlists.length === 0 ? (
            <List.Item title="No watchlists found " />
          ) : (
            watchlists.map((list) => (
              <List.Item
                key={list.watchlist_id}
                title={list.name}
                description={list.notes || ""}
                left={(props) => <List.Icon {...props} icon="playlist-play" />}
                onPress={() => onSelectWatchlist(list.watchlist_id)}
                titleStyle={{ color: theme.colors.onBackground }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />
            ))
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AddToWatchlistDialog;
