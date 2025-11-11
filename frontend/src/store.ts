import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import themeReducer from "../slice/themeSlice";
import bookshelfReducer from "../slice/bookshelfSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "bookshelf", "theme"], // only persist the user slice
};

const rootReducer = combineReducers({
  user: userReducer,
  bookshelf: bookshelfReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
