import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import MapPage from "../pages/MapPage";
import InitConnection from "../pages/InitConnection";
import { SocketProvider } from "../context/SocketContext";

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <SocketProvider>
      <NavigationContainer>
        <Stack.Navigator
          headerMode={"none"}
        >
          <Stack.Screen name="InitConnection" component={InitConnection} />
          <Stack.Screen name="MapPage" component={MapPage} />


        </Stack.Navigator>

      </NavigationContainer>
    </SocketProvider>
  );
};

export default AppStack;
