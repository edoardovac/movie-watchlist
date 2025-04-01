import { Button, Dialog, Portal } from "react-native-paper";
import { SortOption } from "../types/SortOption";

const SORT_OPTIONS = [
  { label: "Date Added (Newest)", value: "addedNewest" },
  { label: "Date Added (Oldest)", value: "addedOldest" },
  { label: "Title (A-Z)", value: "titleAsc" },
  { label: "Title (Z-A)", value: "titleDesc" },
  { label: "Year (Oldest → Newest)", value: "yearAsc" },
  { label: "Year (Newest → Oldest)", value: "yearDesc" },
  { label: "Runtime (Shortest → Longest)", value: "runtimeAsc" },
  { label: "Runtime (Longest → Shortest)", value: "runtimeDesc" },
  { label: "Rating (Highest → Lowest)", value: "rating" },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  selected: SortOption;
  onSelect: (option: SortOption) => void;
};

const MovieFilter = ({ visible, onClose, selected, onSelect }: Props) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title>Sort Movies By</Dialog.Title>
        <Dialog.Content>
          {SORT_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              mode={selected === opt.value ? "contained" : "text"}
              onPress={() => {
                onSelect(opt.value);
                onClose();
              }}
              style={{ marginBottom: 4 }}
            >
              {opt.label}
            </Button>
          ))}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default MovieFilter;
