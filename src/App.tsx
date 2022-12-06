import { Suspense } from "react";
import { Root } from "react-dom/client";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useGetUsersQuery } from "./redux/users";

function App() {
	const appState = useSelector<RootState>(state => state.appState);

	const { data: users, isLoading } = useGetUsersQuery();

	if (isLoading) return <div>Loading....</div>;

	return (
		<div className="border">
			<h1 className="text-4xl">Chat</h1>

			<Suspense fallback={<div>Loadding</div>}>
				<select>
					{users.map(user => (
						<option key={user.id}>{user.name}</option>
					))}
				</select>
			</Suspense>
			<pre>{JSON.stringify(appState)}</pre>
		</div>
	);
}

export default App;
