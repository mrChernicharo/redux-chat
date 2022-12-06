import { Suspense } from "react";
import { Root } from "react-dom/client";
import { useDispatch, useSelector } from "react-redux";
import { setUserId } from "./redux/app-state";
import { useGetChatsQuery } from "./redux/chats";
import { RootState } from "./redux/store";
import { useGetUsersQuery } from "./redux/users";

function Roster() {
	const userId = useSelector<RootState, number>(
		state => state.appState.userId as number
	);

	const { data: chats, isLoading, isFetching } = useGetChatsQuery(userId);

	if (isLoading) return <div>Loading Chats...</div>;

	return (
		<div>
			<div>
				<span>User id: </span>
				<span>{userId}</span>
			</div>

			<pre>{isFetching ? "fetching..." : JSON.stringify(chats, null, 2)}</pre>
		</div>
	);
}

function App() {
	const dispatch = useDispatch();

	const { data: users, isLoading } = useGetUsersQuery();

	if (isLoading || !users) return <div>Loading....</div>;

	return (
		<div className="border">
			<h1 className="text-4xl">Chat</h1>

			<Suspense fallback={<div>Loadding</div>}>
				<select
					onChange={e => {
						dispatch(setUserId(+e.target.value));
					}}>
					{users.map(user => (
						<option key={user.id} value={user.id}>
							{user.name}
						</option>
					))}
				</select>
			</Suspense>

			<Roster />

			{/* <pre>{JSON.stringify(appState)}</pre> */}
		</div>
	);
}

export default App;
