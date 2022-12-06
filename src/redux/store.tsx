import { configureStore } from "@reduxjs/toolkit";
import appState from "./app-state";
import { chatsApi } from "./chats";
import { usersApi } from "./users";

export const store = configureStore({
	reducer: {
		appState,
		[usersApi.reducerPath]: usersApi.reducer,
		[chatsApi.reducerPath]: chatsApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(usersApi.middleware, chatsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
