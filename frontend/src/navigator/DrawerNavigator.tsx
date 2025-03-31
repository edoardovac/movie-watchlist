import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screen/HomeScreen";
import SettingsScreen from "../screen/SettingsScreen";
import LoginScreen from "../screen/LoginScreen";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
