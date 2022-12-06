import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import db from "../supabase";

export type User = { id: number; name: string };

export const usersApi = createApi({
	reducerPath: "users",
	baseQuery: fakeBaseQuery(),
	endpoints: build => ({
		getUsers: build.query<void, void>({
			// @ts-ignore
			queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
				const result = await db.from("users").select("*");
				return result;
			},
		}),
	}),
});

export const { useGetUsersQuery } = usersApi;
