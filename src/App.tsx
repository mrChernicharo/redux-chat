import { Route, Routes } from "react-router-dom";
import db from "./supabase";

function Chat() {
	return (
		<div className="border">
			<h1 className="text-4xl">Chat</h1>
		</div>
	);
}

function Login() {
	// const { data } = await db.from("users").select("*");

	return (
		<div className="border">
			<h1 className="text-4xl">Login</h1>
		</div>
	);
}

function NotFound() {
	return (
		<div className="border">
			<h1 className="text-4xl">NotFound</h1>
		</div>
	);
}

function App() {
	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/chat" element={<Chat />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;
