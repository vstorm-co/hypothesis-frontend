// @ts-nocheck
import { render } from 'preact';
import { LocationProvider, Router, Route, useLocation } from 'preact-iso';
import { configureStore } from './state/chats-store';
import { useStore } from './state/store';
import { GoogleOAuthProvider } from '@react-oauth/google';

configureStore();

import { Chat } from './pages/Chat.jsx';
import { NotFound } from './pages/_404.jsx';
import { SideBar } from './components/SideBar/SideBar';
import { AdminBar } from './components/AdminBar/AdminBar';

import './style.css';

export function App() {
	const [state, dispatch] = useStore();

	return (
		<GoogleOAuthProvider clientId="670841656210-ln6g7cgt7ffqv4dpu0qesm2fk8rv7ckb.apps.googleusercontent.com">
			<LocationProvider>
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
			</LocationProvider>
		</GoogleOAuthProvider>
	);
}

render(<App />, document.getElementById('app'));
