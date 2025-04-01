import { createContext, useContext, useState } from "react";
import { Snackbar } from "react-native-paper";

type SnackbarContextType = {
  showMessage: (msg: string) => void;
  hideMessage: () => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showMessage = (msg: string) => {
    console.log("SNACKBAR:", msg);
    setMessage(msg);
    setVisible(true);
  };

  const hideMessage = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{ showMessage, hideMessage }}>
      <>
        {children}
        <Snackbar
          visible={visible}
          onDismiss={hideMessage}
          duration={3000}
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
          }}
          action={{
            label: "Hide",
            onPress: () => {
              setVisible(false);
            },
          }}
        >
          {message}
        </Snackbar>
      </>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  return context;
};
