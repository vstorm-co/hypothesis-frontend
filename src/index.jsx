// @ts-nocheck
import "preact/devtools";
import { render } from 'preact';
import { LocationProvider, Router, Route, useLocation } from 'preact-iso';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider, useDispatch } from "react-redux";

import store from './store/index';

import { Authorize } from "./pages/Authorize";
import { Chat } from './pages/Chat.jsx';
import { NotFound } from './pages/_404.jsx';
import { SideBar } from './components/SideBar/SideBar';
import { AdminBar } from './components/AdminBar/AdminBar';

import './style.css';
import 'prismjs/themes/prism.css'

export function App() {
	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<LocationProvider>
				<Provider store={store}>
					<main>
						<div className="flex">
							<SideBar />
							<Router>
								<Route path="/" component={Chat} />
								<Route path="/auth" component={Authorize} />
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
