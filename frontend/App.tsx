import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigator/DrawerNavigator";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./src/context/AuthContext";
import { SnackbarProvider } from "./src/context/SnackbarContext";
import { ThemeProvider, useThemeContext } from "./src/context/ThemeContext";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WelcomeDialog from "./src/components/WelcomeDialog";

export default function App() {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const checkFirstRun = async () => {
      const seen = await AsyncStorage.getItem("tutorial_seen");
      if (!seen) {
        setShowTutorial(true);
      }
    };
    checkFirstRun();
  }, []);

  const handleDismissTutorial = async () => {
    setShowTutorial(false);
    await AsyncStorage.setItem("tutorial_seen", "yes");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <InnerApp
          showTutorial={showTutorial}
          handleDismissTutorial={handleDismissTutorial}
        />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const InnerApp = ({
  showTutorial,
  handleDismissTutorial,
}: {
  showTutorial: boolean;
  handleDismissTutorial: () => void;
}) => {
  const { theme } = useThemeContext();

  return (
    <PaperProvider theme={theme}>
      <SnackbarProvider>
        <AuthProvider>
          <NavigationContainer>
            <DrawerNavigator />
            <WelcomeDialog
              visible={showTutorial}
              onDismiss={handleDismissTutorial}
            />
          </NavigationContainer>
        </AuthProvider>
      </SnackbarProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
