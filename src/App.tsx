import { Suspense, useEffect, useRef } from "react";
import { Root } from "react-dom/client";
import { useDispatch, useSelector } from "react-redux";
import { setChatId, setUserId } from "./redux/app-state";
import { useGetChatsQuery } from "./redux/chats";
import {
	Message,
	useGetChatMessagesQuery,
	usePostMessageMutation,
} from "./redux/messages";
import { RootState } from "./redux/store";
import { useGetUsersQuery } from "./redux/users";

function MessageDisplay() {
	const messagePaneRef = useRef<HTMLDivElement>(null);

	const chatId = useSelector<RootState, number>(
		state => state.appState.chatId as number
	);

	const { data: messages, isLoading } = useGetChatMessagesQuery(chatId);

	const { data: users } = useGetUsersQuery();

	if (isLoading || !messages || !users)
		return (
			<div className="relative border h-[calc(100vh-200px)] ">
				...loading messages
			</div>
		);

	return (
		<div className="relative border h-[calc(100vh-200px)] ">
			<div
				ref={messagePaneRef}
				className="absolute bottom-0 w-full border max-h-[calc(100vh-200px)] overflow-y-auto"
			>
				{messages
					? messages.map(msg => (
							<div key={msg.id} className="border">
								<div>{msg.author.name}</div>
								<div>{new Date(msg.timestamp).toLocaleString()}</div>
								<div>{msg.body}</div>
								{msg.reactions.map(r => (
									<div key={r.id}>
										<div>
											{users.find(u => u.id === r.user_id)!.name}
										</div>
										<div>{r.reaction}</div>
									</div>
								))}
							</div>
					  ))
					: null}
			</div>
		</div>
	);
}

function MessageInput() {
	const textRef = useRef<HTMLTextAreaElement>(null);

	const chatId = useSelector<RootState, number>(
		state => state.appState.chatId as number
	);

	const userId = useSelector<RootState, number>(
		state => state.appState.userId as number
	);

	const [postMessage, { data, isLoading }] = usePostMessageMutation();

	return (
		<div className="">
			<div className="h-[150px]">
				<textarea
					ref={textRef}
					className="w-full h-full p-2 resize-none"
					onKeyUp={e => {
						e.preventDefault();
						if (
							e.key === "Enter" &&
							textRef.current?.value.replace(/\n/g, "")
						) {
							postMessage({
								userId,
								chatId,
								body: textRef.current.value,
							});
							textRef.current.value = "";
						}
					}}
				/>
			</div>
			<div className="flex justify-end border">
				<button
					className="w-20 mt-2 mb-1.5 mr-2 rounded-full bg-cyan-700 p-1"
					onClick={() => {
						if (textRef.current?.value) {
							postMessage({
								userId,
								chatId,
								body: textRef.current.value,
							});
							textRef.current.value = "";
						}
					}}
				>
					{isLoading ? "Sending..." : "Send"}
					{/* Send */}
				</button>
			</div>
		</div>
	);
}

function Messages() {
	return (
		<div>
			<MessageDisplay />

			<MessageInput />
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
							style={{ background: chat.id === chatId ? "#999" : "" }}
						>
							<button
								className="p-2"
								onClick={() => dispatch(setChatId(chat.id))}
							>
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
		<div className="grid grid-cols-6 h-screen">
			<div className="border col-start-1 col-end-3">
				<select
					onChange={e => {
						dispatch(setUserId(+e.target.value));
					}}
				>
					{users.map(user => (
						<option key={user.id} value={user.id}>
							{user.name}
						</option>
					))}
				</select>

				<Roster />
			</div>
			<div className="border col-start-3 col-end-7">
				<Messages />
			</div>
		</div>
	);
}

export default App;
