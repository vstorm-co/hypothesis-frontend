import { ToolBar } from '../components/ToolBar/ToolBar';
import { useSelector, useDispatch } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import { useState } from 'preact/hooks';
import { sendMessage } from '../store/chats-slice';

import send from '../assets/send.svg';



export function Chat(props) {
	const chats = useSelector(state => state.chats.chats);
	const messages = useSelector(state => state.chats.messages);

	const [input, setInput] = useState('');
	const dispatch = useDispatch();

	function handleInputChange(event) {
		setInput(event.target.value);
	}

	useWebSocket(`ws://api.projectannotation.testapp.ovh/chat/ws/${props.params.id}`, {
		onOpen: () => {
			console.log("CONNECTED")
		},
		onClose: () => {
			console.log("CLOSED")
		},
		onError: (err) => {
			console.log(err);
		}
	})

	// const ws = new WebSocket(`ws://api.projectannotation.testapp.ovh/chat/ws/${props.params.id}`);
	// ws.onopen = function (e) {
	// 	console.log("AAAA");
	// 	console.log(e);
	// }
	// ws.onmessage = function (event) {
	// 	console.log(event.data);
	// };

	function isChatSelected() {
		return chats.some(chat => chat.selected === true);
	}

	return (
		<div className={'flex w-full'}>
			<div>
				{isChatSelected() && <ToolBar />}
			</div>

			<div className="mx-auto">
				<div className="h-[100vh] flex flex-col pt-4 pb-2">
					<div className="max-w-[720px] max-h-[460px] overflow-auto">



					</div>
					<div className="mt-auto">
						<textarea value={input} className="w-[720px] h-[156px] bg-[#F2F2F2] border rounded border-[#DBDBDB] focus:outline-none p-4 resize-none text-sm leading-6"></textarea>
					</div>
					<div className="flex justify-end items-center mt-2 gap-x-4">
						{/* <button className="text-[#747474] text-sm leading-6 font-bold">Save As Template</button> */}
						<button className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">Send Message<img className="ml-2" src={send} alt="" /></button>
					</div>
				</div>
			</div>
		</div>
	);
}