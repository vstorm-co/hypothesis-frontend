// @ts-nocheck
import "preact/devtools";
import { render } from 'preact';
import { LocationProvider, Router, Route, useLocation } from 'preact-iso';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider, useDispatch } from "react-redux";
import { useEffect } from 'preact/hooks';

import { getChatsData } from "./store/chats-slice";

import store from './store/index';

import { Chat } from './pages/Chat.jsx';
import { NotFound } from './pages/_404.jsx';
import { SideBar } from './components/SideBar/SideBar';
import { AdminBar } from './components/AdminBar/AdminBar';

import './style.css';

export function App() {
	return (
		<GoogleOAuthProvider clientId="670841656210-ln6g7cgt7ffqv4dpu0qesm2fk8rv7ckb.apps.googleusercontent.com">
			<LocationProvider>
				<Provider store={store}>
					<main>
						<div className="flex">
							<SideBar />
							<Router>
								<Route path="/" component={Chat} />
								<Route path="/:id" component={Chat} />
								<Route default component={NotFound} />
							</Router>
							<AdminBar />
						</div>
					</main>
				</Provider>
			</LocationProvider>
		</GoogleOAuthProvider>
	);
}

render(<App />, document.getElementById('app'));
