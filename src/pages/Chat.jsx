import { useState, useEffect, useRef } from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { signal, useSignal } from '@preact/signals';
import useWebSocket from 'react-use-websocket';
import { route } from 'preact-router'
// import ContentEditable from 'react-contenteditable'

import { UseTemplate } from '../components/ToolBars/ChatToolbar/UseTemplate';
import { ChatToolBar } from '../components/ToolBars/ChatToolbar/ChatToolBar';
import { Message } from '../components/Message';
import { Loading } from '../components/Loading';
import { Toast } from '../components/Toast';

import { chatsActions, getChatsData, selectChat, updateChat } from '../store/chats-slice';
import { getUserOrganizationsData } from '../store/user-slice';
import { getTemplatesData } from '../store/templates-slice';

import send from '../assets/send.svg';
import { current } from '@reduxjs/toolkit';

const msgLoading = signal(true);
export function Chat(props) {
	const currentChat = useSelector(state => state.chats.currentChat);
	const chats = useSelector(state => state.chats.chats);
	const templates = useSelector(state => state.templates.templates);
	const user = useSelector(state => state.user.currentUser);

	const activeUsers = useSignal([]);
	const WhosTyping = useSignal([]);

	const input = useRef('');
	const [text, setText] = useState('');
	const [preview, setPreview] = useState('');

	const [promptMode, setPromptMode] = useState('write');

	const dispatch = useDispatch();

	const chatRef = useRef(null);

	const updatePreviewValue = (val) => {
		setPreview(val);
	}

	useEffect(() => {
		dispatch(selectChat(props.matches.id));

		dispatch(getUserOrganizationsData());
		dispatch(getChatsData(props.matches.id));
		dispatch(getTemplatesData());

		// get organization-shared chats
	}, [user])

	useEffect(() => {
		console.log(currentChat);
	}, [currentChat])

	useEffect(() => {
		if (user.access_token === null) {
			route('/auth');
			localStorage.setItem("redirect_to_chat", props.matches.id);
		}

		setTimeout(() => {
			chatRef.current.scrollTop = chatRef.current.scrollHeight
		}, 300);
	}, [currentChat.messages])

	function handleInputChange(event) {
		input.current = event.target.value;
	}

	function handleKeyDown(event) {
		sendMessage(JSON.stringify({ type: 'user_typing', user: user.email }))
		if (event.key === 'Enter') {
			if (event.shiftKey) {

			} else {
				event.preventDefault();
				sendMsg();
			}
		}
	}
	const { sendMessage } = useWebSocket(`${import.meta.env.VITE_WS_URL}/${props.matches.id}/${user.access_token}`, {

		onOpen: () => {
			activeUsers.value = [];

			let msgToSend = localStorage.getItem("MsgToSend");

			if (msgToSend) {
				setTimeout(() => {
					dispatch(chatsActions.addMessage({ created_by: "user", sender_picture: user.picture, content: msgToSend }));
					sendMessage(JSON.stringify({ type: 'message', content: msgToSend }))

					localStorage.removeItem("MsgToSend");
					msgLoading.value = false;
				}, 500)
			} else {
				msgLoading.value = false;
			}
		},
		onClose: (event) => {
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
			} else if (json_data.type === 'user_left') {
				if (activeUsers.value.find(u => u.user_email === json_data.user_email)) {
					let index = activeUsers.value.indexOf(activeUsers.value.find(u => u.user_email === json_data.user_email));
					console.log(index);
					activeUsers.value.splice(index, 1);
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

	const generatePreview = () => {
		const parser = new DOMParser();
		const htmlText = parser.parseFromString(text, 'text/html');
		console.log(text);

		let templates = htmlText.querySelectorAll('span');

		let textStripped = text.replace(/<(?!br\s*\/?)[^>]+>/g, '');
		console.log(textStripped);

		let targetPreview = textStripped;

		templates.forEach(temp => {
			console.log(targetPreview);
			targetPreview = targetPreview.replace(temp.innerHTML, temp.dataset.content)
		});

		setPreview(targetPreview);
	}

	const sendMsg = () => {
		const parser = new DOMParser();
		const htmlText = parser.parseFromString(text, 'text/html');

		let templates = htmlText.querySelectorAll('span');

		let textStripped = text.replace(/<(?!br\s*\/?)[^>]+>/g, '');

		let targetPreview = textStripped;

		templates.forEach(temp => {
			targetPreview = targetPreview.replace(temp.innerHTML, temp.dataset.content)
		});


		msgLoading.value = true;

		console.log(preview);

		dispatch(chatsActions.addMessage({ created_by: "user", sender_picture: user.picture, content: targetPreview }));

		if (currentChat.messages?.length === 0 && currentChat.name === 'New Chat') {
			dispatch(updateChat({ uuid: currentChat.uuid, name: targetPreview, share: currentChat.share, organization_uuid: currentChat.organization_uuid, visibility: currentChat.visibility }))
		}

		setTimeout(() => {
			chatRef.current.scrollTop = chatRef.current.scrollHeight
		}, 100);

		sendMessage(JSON.stringify({ type: 'message', content: targetPreview }))
		setText('');

	}

	function handleUseTemplate(template) {
		console.log(template);
		setText(`${text ? text : ''}<span contenteditable='false' data-content='${template.content}' class="py-1 px-2 bg-[#747474] rounded text-white text-sm">${template.name}</span>`)
	}

	let MockMessage = {
		created_by: 'bot',
		content: chats.length > 1 ?
			`Welcome ${user.name?.split(" ")[0]}, start this chat by entering a prompt below.`
			:
			`Welcome ${user.name?.split(" ")[0]}, start your first chat with me by entering a prompt below.`,
	}

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
					<div className="2xl:max-w-[1280px] max-w-[860px] w-full overflow-y-auto pb-4" ref={chatRef}>
						{currentChat.messages?.length === 0 &&
							<div>
								<Message Message={MockMessage} />
							</div>
						}
						{currentChat.messages?.map(msg => (
							<Message Message={msg} />
						))}
						<div className={'flex justify-center py-4 ' + (msgLoading.value ? '' : 'hidden')}>
							<Loading />
						</div>
					</div>
					<form onSubmit={() => { sendMsg(); }} className="mt-auto">
						{templates?.length > 0 &&
							<div className={'flex'}>
								<UseTemplate TemplatePicked={handleUseTemplate} />

								<div className={'ml-auto flex items-center justify-center'}>
									<div onClick={() => { setPromptMode('write') }} className={'px-4 cursor-pointer py-1 border-[#DBDBDB] border-b-0 border-b-white -mb-[1px] rounded-t ' + (promptMode === 'write' ? 'border bg-[#F2F2F2]' : '')}>
										Write
									</div>
									<div onClick={() => { setPromptMode('preview'); generatePreview(); }} className={'px-4 cursor-pointer py-1 -mb-[1px] border-[#DBDBDB] border-b-0 rounded-t ' + (promptMode === 'preview' ? 'border bg-white' : '')}>
										Preview
									</div>
								</div>
							</div>}
						{/* <ContentEditable html={input.current} onKeyDown={handleKeyDown} onChange={handleInputChange} className="msg w-full h-[156px] bg-[#F2F2F2] border overflow-auto rounded-tl-none rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6">
						</ContentEditable> */}
						{promptMode === 'write' &&
							<div contentEditable={true} onKeyDown={handleKeyDown} onInput={e => setText(e.currentTarget.innerHTML)} dangerouslySetInnerHTML={{ __html: text }} className="msg w-full h-[156px] bg-[#F2F2F2] border overflow-auto rounded-tl-none rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6">
								{text}
							</div>}
						{promptMode === 'preview' &&
							<div dangerouslySetInnerHTML={{ __html: preview }} className="msg w-full h-[156px] bg-white border overflow-auto rounded-t-none rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6">
								{preview}
							</div>
						}
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
						<button type="submit" onClick={() => { sendMsg(); }} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">Send Message<img className="ml-2" src={send} alt="" /></button>
					</div>
				</div>
			</div>
		</div>
	);
}