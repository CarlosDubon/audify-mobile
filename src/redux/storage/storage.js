import AsyncStorage from "@react-native-async-storage/async-storage";
import persistReducer from "redux-persist/es/persistReducer";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { persistStore } from "redux-persist";
import { createLogger } from "redux-logger";

import UserReducer from "../reducers/user";
import ConfigReducer from "../reducers/config";


const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};
const reducers = combineReducers({
  user: UserReducer,
  config: ConfigReducer
});
const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
  persistedReducer,
  applyMiddleware(createLogger()),
);

export const persistor = persistStore(store);
export default store;
