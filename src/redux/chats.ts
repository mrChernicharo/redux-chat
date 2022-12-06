import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { PostgrestResponse } from "@supabase/supabase-js";
import db from "../supabase";

export type Chat = { id: number; name: string };

export const chatsApi = createApi({
	reducerPath: "chats",
	baseQuery: fakeBaseQuery(),
	endpoints: build => ({
		getChats: build.query<Chat[], number>({
			// @ts-ignore
			queryFn: async (userId, queryApi, extraOptions, baseQuery) => {
				const response = await db
					.from("chat_participants")
					.select("*, chat:chats(*)")
					.eq("user_id", userId);

				const userChats = (
					response as PostgrestResponse<{ chat: Chat }>
				).data?.map(entry => entry.chat);

				return { data: userChats };
			},
		}),
	}),
});

export const { useGetChatsQuery } = chatsApi;
