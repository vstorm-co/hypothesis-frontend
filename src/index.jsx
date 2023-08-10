import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import { configureStore } from './state/chats-store';

configureStore();

import { Chat } from './pages/Chat.jsx';
import { NotFound } from './pages/_404.jsx';
import { SideBar } from './components/SideBar/SideBar';
import { ToolBar } from './components/ToolBar/ToolBar';
import { AdminBar } from './components/AdminBar/AdminBar';

import './style.css';

export function App() {
	return (
		<LocationProvider>
			<main>
				<div className="flex">
					<SideBar />
					<ToolBar />
					<Router>
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
