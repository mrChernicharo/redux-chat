import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppState = { userId: number | null; chatId: number | null };

const initialState: AppState = {
	userId: 1,
	chatId: null,
};

const appStateSlice = createSlice({
	name: "appState",
	initialState: initialState,
	reducers: {
		setUserId: (state, { payload }: PayloadAction<number>) => {
			state.userId = payload;
		},
		setChatId: (state, { payload }: PayloadAction<number>) => {
			state.chatId = payload;
		},
	},
});

export const { setUserId, setChatId } = appStateSlice.actions;

export default appStateSlice.reducer;
