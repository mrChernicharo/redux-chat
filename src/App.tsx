import { Suspense, useEffect } from "react";
import { Root } from "react-dom/client";
import { useDispatch, useSelector } from "react-redux";
import { setChatId, setUserId } from "./redux/app-state";
import { useGetChatsQuery } from "./redux/chats";
import { useGetChatMessagesQuery } from "./redux/messages";
import { RootState } from "./redux/store";
import { useGetUsersQuery } from "./redux/users";

function Messages() {
	const userId = useSelector<RootState, number>(
		state => state.appState.userId as number
	);

	const chatId = useSelector<RootState, number>(
		state => state.appState.chatId as number
	);

	const { data: messages, isLoading } = useGetChatMessagesQuery(chatId || 1);
	const { data: users } = useGetUsersQuery();

	if (isLoading || !users) return <div>...loading messages</div>;

	return (
		<div>
			<h2 className="text-2xl">Messages</h2>

			{messages
				? messages.map(msg => (
						<div key={msg.id} className="border">
							<div>{msg.author.name}</div>
							<div>{new Date(msg.timestamp).toLocaleString()}</div>
							<div>{msg.body}</div>
							{msg.reactions.map(r => (
								<div key={r.id}>
									<div>{users.find(u => u.id === r.user_id)!.name}</div>
									<div>{r.reaction}</div>
								</div>
							))}
						</div>
				  ))
				: null}

			{/* <pre>{JSON.stringify(messages, null, 2)}</pre> */}
		</div>
	);
}

function Roster() {
	const dispatch = useDispatch();

	const userId = useSelector<RootState, number>(
		state => state.appState.userId as number
	);

	const chatId = useSelector<RootState, number>(
		state => state.appState.chatId as number
	);

	const { data: chats, isLoading, isFetching } = useGetChatsQuery(userId);

	useEffect(() => {
		if (chats && chats[0]) {
			dispatch(setChatId(chats[0].id));
		}
	}, [chats]);

	if (isLoading) return <div>Loading Chats...</div>;

	return (
		<div>
			<div>
				<span>User id: </span>
				<span>{userId} </span>
				<span>Chat id: </span>
				<span>{isFetching ? "Loading..." : chatId}</span>
			</div>
			<h2 className="text-2xl">Roster</h2>
			<ul>
				{isFetching ? (
					<div>Loading chats...</div>
				) : (
					chats?.map(chat => (
						<li
							key={chat.id}
							style={{ background: chat.id === chatId ? "#999" : "" }}>
							<button
								className="p-2"
								onClick={() => dispatch(setChatId(chat.id))}>
								<div>{chat.name}</div>
							</button>
						</li>
					))
				)}
			</ul>
			{/* <pre>{isFetching ? "fetching..." : JSON.stringify(chats, null, 2)}</pre> */}
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

			<Roster />

			<Messages />

			{/* <pre>{JSON.stringify(appState)}</pre> */}
		</div>
	);
}

export default App;
