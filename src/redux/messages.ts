import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { PostgrestResponse } from "@supabase/supabase-js";
import db from "../supabase";

export type Message = {
	id: number;
	body: string;
	author: { id: string; name: string };
	timestamp: string;
	reactions: { id: number; user_id: number; reaction: string }[];
};

export const messagesApi = createApi({
	reducerPath: "messages",
	baseQuery: fakeBaseQuery(),
	endpoints: build => ({
		getChatMessages: build.query({
			queryFn: async (chatId: number) => {
				const response = await db
					.from("messages")
					.select("*, author:users(*), reactions(id, user_id, reaction)")
					.eq("chat_id", chatId);

				const messages = response.data as Message[];

				console.log(messages);

				return { data: messages };
			},
		}),
	}),
});

export const { useGetChatMessagesQuery } = messagesApi;
