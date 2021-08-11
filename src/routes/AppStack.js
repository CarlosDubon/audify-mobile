import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MapPage from "../pages/MapPage";
import InitConnection from "../pages/InitConnection";
import InitPage from "../pages/InitPage";
import Login from "../pages/Login";
import { configureFonts, DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import SignUp from "../pages/SignUp";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { persistor, store } from "../redux/storage/storage";
import {PersistGate} from 'redux-persist/integration/react';
import ForgetPassword from "../pages/ForgetPassword";

const Stack = createStackNavigator();

const AppStack = () => {
  const fontConfig = {
    web: {
      regular: {
        fontFamily: "sans-serif",
        fontWeight: "normal",
      },
      medium: {
        fontFamily: "sans-serif-medium",
        fontWeight: "normal",
      },
      light: {
        fontFamily: "sans-serif-light",
        fontWeight: "normal",
      },
      thin: {
        fontFamily: "sans-serif-thin",
        fontWeight: "normal",
      },
    },
    ios: {
      regular: {
        fontFamily: "sans-serif",
        fontWeight: "normal",
      },
      medium: {
        fontFamily: "sans-serif-medium",
        fontWeight: "normal",
      },
      light: {
        fontFamily: "sans-serif-light",
        fontWeight: "normal",
      },
      thin: {
        fontFamily: "sans-serif-thin",
        fontWeight: "normal",
      },
    },
    android: {
      regular: {
        fontFamily: "BalooTammudu2-Regular",
      },
      medium: {
        fontFamily: "BalooTammudu2-Medium",
      },
      light: {
        fontFamily: "sans-serif-light",
        fontWeight: "normal",
      },
      thin: {
        fontFamily: "sans-serif-thin",
        fontWeight: "normal",
      },
    },
  };
  const theme = {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
  };
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator
              headerMode={"none"}
            >
              <Stack.Screen name="InitPage" component={InitPage} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="InitConnection" component={InitConnection} />
              <Stack.Screen name="MapPage" component={MapPage} />
              <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default AppStack;
