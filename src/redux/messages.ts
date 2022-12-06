import { createApi, fakeBaseQuery, TagDescription } from "@reduxjs/toolkit/query/react";
import { PostgrestResponse } from "@supabase/supabase-js";
import db from "../supabase";

export type Message = {
	id: number;
	user_id: number;
	chat_id: number;
	body: string;
	author: { id: string; name: string };
	timestamp: string;
	reactions: { id: number; user_id: number; reaction: string }[];
};

export type MessagePayload = {
	userId: number;
	chatId: number;
	body: string;
};

export const messagesApi = createApi({
	reducerPath: "messages",
	tagTypes: ["Messages"], //
	baseQuery: fakeBaseQuery(),
	endpoints: build => ({
		getChatMessages: build.query<Message[], number>({
			queryFn: async (chatId: number) => {
				const response = await db
					.from("messages")
					.select("*, author:users(*), reactions(id, user_id, reaction)")
					.eq("chat_id", chatId);

				const messages = response.data ?? [];

				return { data: messages };
			},
			// prettier-ignore
			providesTags: result =>
				result
					? [ ...result.map(({ id }) => ({ type: "Messages" as const, id })), { type: "Messages", id: "LIST" } ]
					: [{ type: "Messages", id: "LIST" }],
		}),
		postMessage: build.mutation({
			queryFn: async ({ userId, chatId, body }: MessagePayload) => {
				const response = (await db
					.from("messages")
					.insert({ user_id: userId, chat_id: chatId, body })
					.select("*")) as PostgrestResponse<Message>;

				return { data: response };
			},
			invalidatesTags: (result, error, { userId, chatId, body }) => [
				{ type: "Messages", id: "LIST" },
			],
		}),
	}),
});

export const { useGetChatMessagesQuery, usePostMessageMutation } = messagesApi;
