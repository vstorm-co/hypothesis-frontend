// @ts-nocheck
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'preact/hooks';
import { Provider, useDispatch, useSelector } from "react-redux";
import Router from 'preact-router';
import { render } from 'preact';
import "preact/devtools";
import useWebSocket from 'react-use-websocket';


import store from './store/index';

import { Home } from './pages/Home.jsx';
import { PrivacyPolicy } from './pages/PrivacyPolicy.jsx';
import { SideBar } from './components/SideBar/SideBar';
import { Authorize } from "./pages/Authorize";
import { MockChat } from './pages/MockChat';
import { Template } from "./pages/Template";
import { NotFound } from './pages/_404.jsx';
import { SetUp } from './pages/SetUp.jsx';
import { Chat } from './pages/Chat.jsx';

import { getUserOrganizationsData } from "./store/user-slice";
import { getTemplatesData } from "./store/templates-slice";
import { getChatsData, chatsActions, selectChat } from "./store/chats-slice";
import { fetchAvailableProviders, fetchModels, uiActions } from './store/ui-slice';

import 'prismjs/themes/prism.css'
import './style.css';
import { RefreshToken } from './pages/RefreshToken';
import { ScafoldPrompt } from './pages/ScafoldPrompt';
import { OrgSettings } from './pages/OrgSettings';

export function App() {
	useEffect(() => {
		store.dispatch(uiActions.toggleChatsLoading(true))

		store.dispatch(getUserOrganizationsData());
		store.dispatch(getChatsData());
		store.dispatch(getTemplatesData());

		store.dispatch(fetchModels());
		store.dispatch(fetchAvailableProviders());
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
			let json_data = JSON.parse(e.data)

			if (json_data.type === 'room-changed') {
				if (json_data.id === state.chats.currentChat.uuid) {
					store.dispatch(selectChat(json_data.id));
				}
				if (json_data.source === 'delete-annotations') {
					store.dispatch(selectChat(state.chats.currentChat.uuid));
				}
				store.dispatch(getChatsData());
			} else if (json_data.type === 'template-changed') {
				store.dispatch(getTemplatesData());
			} else if (json_data.type === 'optimizing-user-file-content') {
				if (json_data.id === state.chats.currentChat.uuid) {
					store.dispatch(uiActions.toggleFileUpdating(true));
				}
			} else if (json_data.type === 'user-file-updated') {
				if (json_data.id === state.chats.currentChat.uuid) {
					store.dispatch(uiActions.toggleFileUpdating(false));
				}
			}
		}
	});

	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<Provider store={store}>
				<main>
					<div className="flex overflow-hidden">
						<SideBar />
						<div class="chatbox flex w-full">
							<Router>
								<MockChat path="/" />
								<Home path="/home" />
								<PrivacyPolicy path="/privacy-policy" />
								<Authorize path="/auth" />
								<OrgSettings path="/organization-settings" />
								<RefreshToken path="/refresh-token" />
								<SetUp path="/setup" />
								<Chat path="/chats/:id" />
								<Template path="/templates/:id" />
								<ScafoldPrompt path="/default-scafold-prompt" />
								<NotFound default />
							</Router>
						</div>
					</div>
				</main>
			</Provider>
		</GoogleOAuthProvider>
	);
}

render(<App />, document.getElementById('app'));
