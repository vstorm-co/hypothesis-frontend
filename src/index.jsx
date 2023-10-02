// @ts-nocheck
import "preact/devtools";
import { render } from 'preact';
import { LocationProvider, Router, Route, useLocation } from 'preact-iso';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect } from 'preact/hooks';

import store from './store/index';

import { Authorize } from "./pages/Authorize";
import { Chat } from './pages/Chat.jsx';
import { MockChat } from './pages/MockChat';
import { Template } from "./pages/Template";
import { NotFound } from './pages/_404.jsx';
import { SetUp } from './pages/SetUp.jsx';
import { SideBar } from './components/SideBar/SideBar';
import { AdminBar } from './components/AdminBar/AdminBar';

import { getUserOrganizationsData } from "./store/organizations-slice";
import { getChatsData } from "./store/chats-slice";
import { getTemplatesData } from "./store/templates-slice";

import './style.css';
import 'prismjs/themes/prism.css'

export function App() {
	// const dispatch = useDispatch();
	console.log(store.getState())


	useEffect(() => {
		store.dispatch(getUserOrganizationsData());
		store.dispatch(getChatsData());
		store.dispatch(getTemplatesData());
		// if (user.access_token === null) {
		// 	location.route('/auth')
		// } else {
		// 	// dispatch(getOrganizationsData(user.access_token));
		// 	store.dispatch(getUserOrganizationsData());
		// 	store.dispatch(getChatsData(props.params.id));
		// 	store.dispatch(getTemplatesData());

		// 	// get organization-shared chats
		// 	if (!!user.organization_uuid) {
		// 		// dispatch(getOrganizationChatsData(user.organization_uuid));
		// 	} else {
		// 		store.dispatch(chatsActions.setOrganizationChats([]));
		// 	}
		// }

	}, [])

	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<LocationProvider>
				<Provider store={store}>
					<main>
						<div className="flex">
							<SideBar />
							<Router>
								<Route path="/" component={MockChat} />
								<Route path="/auth" component={Authorize} />
								<Route path="/setup" component={SetUp} />
								<Route path="/chats/:id" component={Chat} />
								<Route path="/templates/:id" component={Template} />
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
