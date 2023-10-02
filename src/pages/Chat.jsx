import { useSelector, useDispatch } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import { useState, useEffect, useRef } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { signal, useSignal } from '@preact/signals';
import ContentEditable from 'react-contenteditable'

import { chatsActions, createChat, getChatsData, getOrganizationChatsData, selectChat } from '../store/chats-slice';
import { Message } from '../components/Message';
import { ChatToolBar } from '../components/ToolBars/ChatToolbar/ChatToolBar';
import { Toast } from '../components/Toast';
import { Loading } from '../components/Loading';
import { UseTemplate } from '../components/ToolBars/ChatToolbar/UseTemplate';

import send from '../assets/send.svg';
import { getUserOrganizationsData } from '../store/organizations-slice';
import { getTemplatesData } from '../store/templates-slice';

const msgLoading = signal(false);
export function Chat(props) {
	const location = useLocation();

	const currentChat = useSelector(state => state.chats.currentChat);
	const user = useSelector(state => state.user.currentUser);

	const activeUsers = useSignal([]);
	const WhosTyping = useSignal([]);

	const input = useRef('');
	const [text, setText] = useState();

	const dispatch = useDispatch();

	const chatRef = useRef(null);

	useEffect(() => {
		dispatch(selectChat(props.params.id));
	}, [])

	useEffect(() => {
		if (user.access_token === null) {
			location.route('/auth')
		}

		// dispatch(getOrganizationsData(user.access_token));
		dispatch(getUserOrganizationsData());
		dispatch(getChatsData(props.params.id));
		dispatch(getTemplatesData());

		// get organization-shared chats
		if (!!user.organization_uuid) {
			dispatch(getOrganizationChatsData(user.organization_uuid));
		} else {
			dispatch(chatsActions.setOrganizationChats([]));
		}

		setTimeout(() => {
			chatRef.current.scrollTop = chatRef.current.scrollHeight
		}, 300);

		setTimeout(() => {
			chatRef.current.scrollTop = chatRef.current.scrollHeight
		}, 300);
	}, [currentChat.messages])

	function handleInputChange(event) {
		sendMessage(JSON.stringify({ type: 'user_typing', user: user.email }))
		input.current = event.target.value;
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
			// 	const newSocket = new WebSocket(`${import.meta.env.VITE_WS_URL}/${props.params.id}`);
			// 	// Reconnect logic here
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
			let typingTimeout;

			if (json_data.type === 'message') {
				if (user.email != json_data.sender_email && json_data.created_by != 'bot') {
					dispatch(chatsActions.addMessage({ created_by: "user", sender_email: json_data.email, sender_picture: json_data.sender_picture, content: message }));
				} else {
					if (currentChat.messages[currentChat.messages.length - 1].created_by === 'user') {
						dispatch(chatsActions.addMessage({ created_by: "bot", content: '' }))
					} else {
						dispatch(chatsActions.concatDataToMsg({ data: message }))
					}
				}
			} else if (json_data.type === 'user_joined') {
				if (!activeUsers.value.find(u => u.user_email === json_data.user_email)) {
					activeUsers.value.push({
						...json_data
					})
				}
			} else if (json_data.type === 'typing') {
				clearTimeout(typingTimeout);
				if (!WhosTyping.value.find(u => u.name === json_data.content)) {
					WhosTyping.value.push({ name: json_data.content });

					typingTimeout = setTimeout(() => {
						WhosTyping.value = [];
					}, 3000)
				}
			}

			msgLoading.value = false;
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	})

	function sendMsg() {
		console.log(input);
		msgLoading.value = true;

		dispatch(chatsActions.addMessage({ created_by: "user", sender_picture: user.picture, content: text }));

		setTimeout(() => {
			chatRef.current.scrollTop = chatRef.current.scrollHeight
		}, 100);

		sendMessage(JSON.stringify({ type: 'message', content: text }))
		setText('');
	}

	function handleUseTemplate(template) {
		setText(`${text ? text : ''} ${template.content}`);
		// setText(`${text ? text : ''} <span contenteditable='false' data-content='${template}' class="p-1 bg-[#747474] text-white">${template.name}</span>`)
		// input.current = `${input.current} <span contenteditable='false' class="p-1 bg-[#747474] text-white">${template.name}</span>`
		// handleInputChange({
		// 	target: {
		// 		value: `${input.current} <span contenteditable='false' class="p-1 bg-[#747474] text-white">${template.name}</span>`
		// 	}
		// })
	}

	console.log(currentChat);

	return (
		<div className={'flex w-full mx-4'}>
			<div className={'pt-10 pl-4 flex flex-col'}>
				{activeUsers.value.map(u => (
					<img src={u.sender_picture} className="w-8 h-8 border border-[#DBDBDB] rounded-full" />
				))}
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
							<ChatToolBar />
						</div>
					</div>
					<div className="2xl:max-w-[1280px] max-w-[860px] w-full overflow-y-auto mb-2" ref={chatRef}>
						{currentChat.messages.map(msg => (
							<Message Message={msg} />
						))}
						<div className={'flex justify-center py-4 ' + (msgLoading.value ? '' : 'hidden')}>
							<Loading />
						</div>
					</div>
					<form onSubmit={sendMsg} className="mt-auto">
						<UseTemplate TemplatePicked={handleUseTemplate} />
						{/* <ContentEditable html={input.current} onKeyDown={handleKeyDown} onChange={handleInputChange} className="msg w-full h-[156px] bg-[#F2F2F2] border overflow-auto rounded-tl-none rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6">
						</ContentEditable> */}
						<div contentEditable={true} onKeyDown={handleKeyDown} onInput={e => setText(e.currentTarget.innerHTML)} dangerouslySetInnerHTML={{ __html: text }} className="msg w-full h-[156px] bg-[#F2F2F2] border overflow-auto rounded-tl-none rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6">
							{text}
						</div>
					</form>

					<div className="flex justify-between items-center mt-2 gap-x-4">
						<div className={'text-[#747474] text-xs self-start'}>
							{WhosTyping.value.map(u => (
								<span>{u.name} </span>
							))}
							{WhosTyping.value.length > 0 &&
								<span>

									is typing...
								</span>
							}
						</div>
						<button type="submit" onClick={sendMsg} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">Send Message<img className="ml-2" src={send} alt="" /></button>
					</div>
				</div>
			</div>
		</div>
	);
}