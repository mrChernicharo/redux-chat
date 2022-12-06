import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { PostgrestResponse } from "@supabase/supabase-js";
import db from "../supabase";

export type User = { id: number; name: string };

export const usersApi = createApi({
	reducerPath: "users",
	baseQuery: fakeBaseQuery(),
	endpoints: build => ({
		getUsers: build.query<User[], void>({
			// @ts-ignore
			queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
				const result = await db.from("users").select("*");
				return result as PostgrestResponse<User>;
			},
		}),
	}),
});

export const { useGetUsersQuery } = usersApi;
