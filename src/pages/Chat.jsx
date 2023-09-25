import { useSelector, useDispatch } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import { useState, useEffect, useRef } from 'preact/hooks';
import { useLocation } from 'preact-iso';

import { chatsActions, getChatsData, getOrganizationChatsData, updateChat, createChat } from '../store/chats-slice';
import { Message } from '../components/Message';
import { ToolBar } from '../components/ToolBar/ToolBar';
import { Toast } from '../components/Toast';


import send from '../assets/send.svg';

export function Chat(props) {
	const currentChat = useSelector(state => state.chats.currentChat);
	const user = useSelector(state => state.user.currentUser);
	const location = useLocation();

	const [input, setInput] = useState('');
	const dispatch = useDispatch();

	const chatRef = useRef(null);

	useEffect(() => {
		if (user.access_token === null) {
			location.route('/auth')
		}

		dispatch(getChatsData(props.params.id));

		// get organization-shared chats
		if (!!user.organization_uuid) {
			dispatch(getOrganizationChatsData(user.organization_uuid));
		} else {
			dispatch(chatsActions.setOrganizationChats([]));
		}

		setTimeout(() => {
			chatRef.current.scrollTop = chatRef.current.scrollHeight
		}, 300);
	}, [user])

	function handleInputChange(event) {
		setInput(event.target.value);
	}

	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			if (event.shiftKey) {

			} else {
				event.preventDefault();
				sendMsg();
			}
		}
	}

	const { sendMessage } = useWebSocket(`${import.meta.env.VITE_WS_URL}/${props.params.id}/${user.access_token}`, {
		onOpen: () => {
		},
		onClose: (event) => {
			// // Handle the connection close event
			// if (event.code === 1000) {
			// 	// Normal closure, no need to reconnect
			// 	return;
			// }

			// // Reconnect after a delay (e.g., 3 seconds)
			// setTimeout(() => {
			// 	// Reconnect logic here
			// 	const newSocket = new WebSocket(`${import.meta.env.VITE_WS_URL}/${props.params.id}`);
			// 	newSocket.onopen = () => {
			// 		// Connection reopened, you can handle this event
			// 	};

			// 	newSocket.onmessage = (event) => {
			// 		// Handle incoming messages
			// 		console.log("New message: ", event.data)
			// 	};

			// 	// Update the sendMessage function with the new socket
			// 	sendMessage(newSocket.send.bind(newSocket));
			// }, 3000); // 3 seconds delay
		},
		onError: (err) => {
		},
		onMessage: (e) => {
			// The data is always a string and comes as whatever the server sent
			let json_data = JSON.parse(e.data)
			let message = json_data.message;

			if (user.email != json_data.sender_email && json_data.created_by != 'bot') {
				dispatch(chatsActions.addMessage({ created_by: "user", sender_email: json_data.email, content: message }));
			} else {
				console.log(currentChat.messages[currentChat.messages.length - 1]);
				if (currentChat.messages[currentChat.messages.length - 1].created_by === 'user') {
					dispatch(chatsActions.addMessage({ created_by: "bot", content: input }))
				} else {
					dispatch(chatsActions.concatDataToMsg({ data: message }))
				}
			}

			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	})

	function sendMsg() {
		if (currentChat.uuid === 0) {
			dispatch(createChat(input));
		} else {
			dispatch(chatsActions.addMessage({ created_by: "user", content: input }));
			setTimeout(() => {
				chatRef.current.scrollTop = chatRef.current.scrollHeight
			}, 100);
			sendMessage(input)
			setInput('');
		}
	}

	if (currentChat.name) {
		return (
			<div className={'flex w-full mx-4'}>
				<div>
				</div>
				<div className="mx-auto 2xl:max-w-[1280px] max-w-[860px] w-full">
					<div className="h-[100vh] flex flex-col pt-4 pb-2">
						<div className={'flex justify-between items-center border-b border-[#DBDBDB] relative'}>
							<div className={'text-lg leading-6 font-bold py-5 text-[#595959] '}>
								{currentChat.name}
							</div>

							<div className={'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'}>
								<Toast />
							</div>

							<div>
								<ToolBar />
							</div>
						</div>
						<div className="2xl:max-w-[1280px] max-w-[860px] w-full overflow-y-auto" ref={chatRef}>

							{currentChat.messages.map(chat => (
								<Message Message={chat} />
							))}

						</div>
						<form onSubmit={sendMsg} className="mt-auto">
							<textarea onKeyDown={handleKeyDown} onChange={handleInputChange} value={input} className=" w-full h-[156px] bg-[#F2F2F2] border rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6"></textarea>
						</form>
						<div className="flex justify-end items-center mt-2 gap-x-4">
							{/* <button className="text-[#747474] text-sm leading-6 font-bold">Save As Template</button> */}
							<button type="submit" onClick={sendMsg} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">Send Message<img className="ml-2" src={send} alt="" /></button>
						</div>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div></div>
		)
	}
}