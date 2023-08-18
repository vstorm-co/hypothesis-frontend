import { render } from 'preact';
import { LocationProvider, Router, Route, useLocation } from 'preact-iso';
import { configureStore } from './state/chats-store';
import { useStore } from './state/store';

configureStore();

import { Chat } from './pages/Chat.jsx';
import { NotFound } from './pages/_404.jsx';
import { SideBar } from './components/SideBar/SideBar';
import { AdminBar } from './components/AdminBar/AdminBar';

import './style.css';

export function App() {
	const [state, dispatch] = useStore();

	return (
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
	);
}

render(<App />, document.getElementById('app'));
