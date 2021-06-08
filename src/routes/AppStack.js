import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import MapPage from "../pages/MapPage";
import InitConnection from "../pages/InitConnection";

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="InitConnection" component={InitConnection} />
        <Stack.Screen name="MapPage" component={MapPage} />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default AppStack;
