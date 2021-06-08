/**
 * @format
 */

import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
import AppStack from "./src/routes/AppStack";

AppRegistry.registerComponent(appName, () => AppStack);
