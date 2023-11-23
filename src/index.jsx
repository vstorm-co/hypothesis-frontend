// @ts-nocheck
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'preact/hooks';
import { Provider } from "react-redux";
import Router from 'preact-router';
import { render } from 'preact';
import "preact/devtools";
import useWebSocket from 'react-use-websocket';


import store from './store/index';

import { SideBar } from './components/SideBar/SideBar';
import { Authorize } from "./pages/Authorize";
import { MockChat } from './pages/MockChat';
import { Template } from "./pages/Template";
import { NotFound } from './pages/_404.jsx';
import { SetUp } from './pages/SetUp.jsx';
import { Chat } from './pages/Chat.jsx';

import { getUserOrganizationsData } from "./store/user-slice";
import { getTemplatesData } from "./store/templates-slice";
import { getChatsData, chatsActions } from "./store/chats-slice";

import 'prismjs/themes/prism.css'
import './style.css';

export function App() {
	useEffect(() => {
		store.dispatch(getUserOrganizationsData());
		store.dispatch(getChatsData());
		store.dispatch(getTemplatesData());
	}, [])

	const { sendMessage } = useWebSocket(`${import.meta.env.VITE_LISTENER_WS_URL}`, {

		onOpen: () => {
		},
		onClose: (event) => {
		},
		onError: (err) => {
			console.log(err);
		},
		onMessage: (e) => {
			let state = store.getState();
			let json_data = JSON.parse(JSON.parse(e.data))

			console.log(e);
			console.log(json_data);
			if (e.data === 'room-changed') {
				store.dispatch(getChatsData(state.chats.currentChat.uuid));
			} else if (json_data.type === 'user_joined') {
				console.log(json_data);
				store.dispatch(chatsActions.addUserActive(json_data));
			} else if (json_data.type === 'user_left') {
				console.log(json_data);
				store.dispatch(chatsActions.removeUserActive(json_data));
			} else {
				store.dispatch(getChatsData());
				store.dispatch(getTemplatesData());
			}
		}
	});

	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<Provider store={store}>
				<main>
					<div className="flex overflow-hidden">
						<SideBar />
						<Router>
							<MockChat path="/" />
							<Authorize path="/auth" />
							<SetUp path="/setup" />
							<Chat path="/chats/:id" />
							<Template path="/templates/:id" />
							<NotFound default />
						</Router>
					</div>
				</main>
			</Provider>
		</GoogleOAuthProvider>
	);
}

render(<App />, document.getElementById('app'));
