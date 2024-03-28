// @ts-nocheck
import { useState, useEffect, useRef } from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { signal, useSignal } from '@preact/signals';
import useWebSocket from 'react-use-websocket';
import { route } from 'preact-router'
import { Loading } from '../components/Loading';

import { ChatToolBar } from '../components/ToolBars/ChatToolbar/ChatToolBar';
import { Message } from '../components/Message';
import { Toast } from '../components/Toast';

import { chatsActions, getChatsData, selectChat, updateChat } from '../store/chats-slice';
import { templatesActions } from '../store/templates-slice';

import { PromptInput } from '../components/PromptInput';
import { SmartAnnotateLogs } from '../components/SmartAnnotateLogs';
import { hSliceActions } from '../store/h-slice';

const msgLoading = signal(false);
export function Chat(props) {
	const currentChat = useSelector(state => state.chats.currentChat);
	const logs = useSelector(state => state.h.logs);

	const chats = useSelector(state => state.chats.chats);
	const user = useSelector(state => state.user.currentUser);
	const fileUpdating = useSelector(state => state.ui.fileUpdating);
	const showAnnotateLogs = useSignal(false);

	const blockSending = useSignal(false);
	const forceInputFocus = useSignal(0);

	const previousScroll = useSignal(0);
	const userScrolledUp = useSignal(false);

	const activeUsers = useSignal([]);
	const promptsLeft = useSignal([]);
	const WhosTyping = useSignal([]);

	const [editTitle, setEditTitle] = useState(false);
	const titleInputRef = useRef(null);

	const dispatch = useDispatch();

	const chatRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			let scroll = document.querySelector('.chat-scroll');
			scroll.addEventListener('scroll', (e) => {
				if (previousScroll.value > chatRef.current.scrollTop) {
					userScrolledUp.value = true;
				}
				previousScroll.value = chatRef.current.scrollTop;
			});
			console.log("Registered");
		}, 500);

		forceInputFocus.value = forceInputFocus.value + 1;
	}, [chatRef.current])

	useEffect(() => {
		dispatch(selectChat(props.matches.id));
		dispatch(templatesActions.setCurrentTemplate({}));
	}, [window.location.href])

	useEffect(() => {
		blockSending.value = false;
		userScrolledUp.value = false;
		forceInputFocus.value = forceInputFocus.value + 1;
	}, [currentChat.uuid])

	useEffect(() => {
		if (user.access_token === null) {
			route('/auth');
			localStorage.setItem("redirect_to_chat", props.matches.id);
		}

		setTimeout(() => {
			if (!userScrolledUp.value) {
				chatRef.current.scrollTop = chatRef.current.scrollHeight
			}
		}, 300);

		let promptsToSend = JSON.parse(localStorage.getItem("ANT_PromptsToSend"));
		if (promptsToSend) {
			localStorage.removeItem("ANT_PromptsToSend");
			sendMsgTwo(promptsToSend);
		}
	}, [currentChat.messages])

	const { sendMessage } = useWebSocket(`${import.meta.env.VITE_WS_URL}/${props.matches.id}?token=${user.access_token}`, {

		onOpen: () => {
			activeUsers.value = [];

			let promptsToSend = JSON.parse(localStorage.getItem("ANT_PromptsToSend"));
			if (promptsToSend) {
				localStorage.removeItem("ANT_PromptsToSend");
				sendMsgTwo(promptsToSend);
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
				blockSending.value = true;
				msgLoading.value = true;
				if (user.email != json_data.sender_email && json_data.created_by != 'bot') {
					dispatch(chatsActions.addMessage({ created_by: "user", sender_email: json_data.email, sender_picture: json_data.sender_picture, content: message }));
				} else if (json_data.created_by === 'bot') {
					if (currentChat.messages[currentChat.messages.length - 1].created_by === 'user') {
						dispatch(chatsActions.addMessage({ created_by: "bot", content: message }))
					} else {
						dispatch(chatsActions.concatDataToMsg({ data: message }))
					}
				}

				if (!userScrolledUp.value) {
					chatRef.current.scrollTop = chatRef.current.scrollHeight
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
			} else if (json_data.type === 'bot-message-creation-finished') {
				if (promptsLeft.value.length > 0) {
					dispatch(chatsActions.addMessage({ created_by: "user", sender_picture: user.picture, content: promptsLeft.value[0].prompt, content_html: promptsLeft.value[0].html }));

					sendMessage(JSON.stringify({ type: 'message', content: promptsLeft.value[0].prompt, content_html: promptsLeft.value[0].html }));
					promptsLeft.value.shift();
				} else {
					blockSending.value = false;
					msgLoading.value = false;
					forceInputFocus.value = forceInputFocus.value + 1;

					setTimeout(() => {
						dispatch(getChatsData(currentChat.uuid))
					}, 500)
				}
			} else if (json_data.type === 'sent' || json_data.type === 'recd') {
				dispatch(hSliceActions.addLogs(json_data));
			}
		}
	})

	function tglAnnotateLogs(tgl = !showAnnotateLogs.value) {
		showAnnotateLogs.value = tgl;
	}

	function sendMsgTwo(promptArray) {
		if (promptArray.length > 1) {
			promptsLeft.value = promptArray;
			dispatch(chatsActions.addMessage({ created_by: "user", sender_picture: user.picture, content: promptArray[0].prompt, content_html: promptArray[0].html }));

			sendMessage(JSON.stringify({ type: 'message', content: promptArray[0].prompt, content_html: promptArray[0].html }));
			promptsLeft.value.shift();
		} else {
			dispatch(chatsActions.addMessage({ created_by: "user", sender_picture: user.picture, content: promptArray[0].prompt, content_html: promptArray[0].html }));

			sendMessage(JSON.stringify({ type: 'message', content: promptArray[0].prompt, content_html: promptArray[0].html, }));
		}

		setTimeout(() => {
			chatRef.current.scrollTop = chatRef.current.scrollHeight
			userScrolledUp.value = false;
		}, 100);
	}

	function callEditChatTitle(event) {
		if (event.keyCode === 13) {
			dispatch(updateChat({ uuid: currentChat.uuid, name: event.target.value, share: currentChat.share, organization_uuid: currentChat.organization_uuid, visibility: currentChat.visibility }));
			setTimeout(() => {
				setEditTitle(false);
			}, 100)
		}
	}

	function handleTitleInputClick() {
		if (user.user_id === currentChat.owner) {
			setEditTitle(true);
			setTimeout(() => {
				titleInputRef.current.focus()
			}, 100)
		}
	}

	function EditedAt() {
		const updatedAt = new Date(currentChat.updated_at ? currentChat.updated_at : currentChat.created_at);
		const today = new Date();

		// const diffrence = Math.floor((today.getTime() - updatedAt.getTime()) / (1000 * 3600 * 24));
		var hours = Math.floor(Math.abs(today - updatedAt) / 36e5);
		// var hours = Math.floor(12 * 24);

		if (hours === 0) {
			return 'Just now';
		}

		if (hours < 24) {
			return `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`
		} else if (hours >= 24 && hours < 7 * 24) {
			let days = Math.floor(hours / 24);
			return `${days} ${days > 1 ? 'days' : 'day'} ago`
		} else if (hours >= 7 * 24) {
			let weeks = Math.floor((hours / 24) / 7)
			return `${weeks} ${weeks > 1 ? 'weeks' : 'week'} ago`
		}
	}

	let MockMessage = {
		created_by: 'bot',
		content: chats?.length > 1 ?
			`Welcome ${user.name?.split(" ")[0]}, start this chat by entering a prompt below.`
			:
			`Welcome ${user.name?.split(" ")[0]}, start your first chat with me by entering a prompt below.`,
	}

	function handleUpdateMessage(promptArray) {
		sendMsgTwo(promptArray);
	}

	function handleSubmitButton(value) {
		if (blockSending.value) {
			sendMessage(JSON.stringify({ "type": "stop_generation", "user": user.email }));
			dispatch(getChatsData(currentChat.uuid));
		} else {
			sendMsgTwo(value.promptArray);
		}
	}

	function handleScroll(e) {
		console.log(e)
	}

	if (!currentChat.uuid) {
		return (
			<div className={'w-full h-[100vh] flex justify-center pt-20'}>
				<Loading />
			</div>
		)
	} else {
		return (
			<div className={'flex w-full mx-4 page-chat'}>
				<div className={'pt-10 pl-4 mr-7 flex flex-col'}>
					{activeUsers.value.map(u => (
						<img title={u.user_name} src={u.sender_picture} className="w-8 h-8 border border-[#DBDBDB] rounded-full" />
					))}
					<img className="w-8 h-8 border border-[#DBDBDB] rounded-full invisible" />
				</div>
				<div className="mx-auto 2xl:max-w-[1280px] max-w-[860px] w-full">
					<div className="h-[100vh] flex flex-col pt-4 pb-2 relative">
						<div className={'flex items-center py-3 border-b border-[#DBDBDB] relative'}>
							<div onClick={() => { handleTitleInputClick() }} class="flex items-center w-full cursor-pointer">
								<div className={'text-lg leading-6 font-bold py-2 max-h-[156px] overflow-hidden text-[#595959] ' + (editTitle ? 'hidden' : '')}>
									{currentChat.name}
								</div>
								<div className={'w-full ' + (editTitle ? '' : 'hidden')}>
									<div className={'border p-2 bg-[#FAFAFA] border-[#DBDBDB] rounded w-full flex items-center'}>
										<input ref={titleInputRef} value={currentChat.name} onKeyDown={(e) => callEditChatTitle(e)} className={'text-lg text-[#595959] font-bold leading-6 focus:outline-none bg-[#FAFAFA] w-full'} type="text" />
										<div onClick={(e) => { setEditTitle(false); e.stopPropagation() }} className={'pr-1 cursor-pointer'}>
											<svg width="10" height="11" viewBox="0 0 10 11" xmlns="http://www.w3.org/2000/svg">
												<path d="M9.32179 2.58465L9.24249 2.67158L6.41385 5.499L9.24249 8.32843C9.63302 8.71896 9.63302 9.35212 9.24249 9.74265C8.88201 10.1031 8.31478 10.1309 7.92249 9.82583L7.82828 9.74265L4.99985 6.914L2.17142 9.74265C1.25719 10.6569 -0.100321 9.35479 0.677915 8.41536L0.757211 8.32843L3.58485 5.5L0.757211 2.67158C0.366687 2.28105 0.366687 1.64789 0.757211 1.25736C1.11769 0.89688 1.68493 0.86915 2.07722 1.17417L2.17142 1.25736L4.99985 4.085L7.82828 1.25736C8.71395 0.371694 10.0156 1.56601 9.38857 2.49559L9.32179 2.58465Z" fill="#747474" />
											</svg>
										</div>
									</div>
									<div className={'text-[10px] mt-0.5 py-2 -mb-2 pr-2 text-right text-[#747474]'}>
										press 'Enter' to confirm
									</div>
								</div>
							</div>

							<div className={'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'}>
								<Toast />
							</div>

							<div className={'ml-5 text-xs text-[#747474] shrink-0'}>
								{EditedAt()}
							</div>
							<div className={'ml-5 shrink-0'}>
								<ChatToolBar />
							</div>
						</div>
						<div onScroll={(e) => { handleScroll(e) }} className="2xl:max-w-[1280px] chat-scroll max-w-[860px] w-full h-full overflow-y-auto overflow-x-visible pb-4" ref={chatRef}>
							{/* <Message Message={{ created_by: 'annotation', content: 'Created 6 annotations from https://www.npr.org/2024/02/15/1196978636/what-to-do-with-your-childhood-stuff, with the prompt: “Summarize the most important facts about this article”.' }} /> */}
							{/* <Message Message={{ created_by: 'annotation', content: '' }} /> */}
							{currentChat.messages?.length === 0 &&
								<div>
									<Message Message={MockMessage} />
								</div>
							}
							{currentChat.messages?.map(msg => (
								<Message handleUpdateMessage={handleUpdateMessage} Message={msg} />
							))}
						</div>
						<div className={'relative'}>
							<PromptInput
								Icon={(blockSending.value ? 'stop' : 'send')}
								blockSending={blockSending.value}
								SubmitButtonText={(blockSending.value ? 'Stop Generating' : 'Send Message')}
								handleSubmitButton={(value) => { handleSubmitButton(value) }}
								SecondButton={false}
								SecondButtonText={''}
								handleSecondButton={() => { }}
								WSsendMessage={value => { sendMessage(value) }}

								clearInputOnSubmit={true}
								forceFocus={forceInputFocus.value}
							/>
							<div className={'absolute bottom-0 text-[#747474] text-xs self-start py-2'}>
								{fileUpdating &&
									<div className={'text-[#EF4444]'}>
										Papaya is refreshing content of file included in this prompt. It may take some time to complete this proccess
									</div>
								}
								<div>
									{WhosTyping.value.map(u => (
										<span>{u.name} </span>
									))}
									{WhosTyping.value.length > 0 &&
										<span>

											is typing...
										</span>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div onClick={() => tglAnnotateLogs()} className={'absolute bottom-4 right-8 underline cursor-pointer text-[#595959] ' + (logs.length > 0 ? 'flex' : 'hidden')}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M18 4C19.1046 4 20 4.89543 20 6V19C20 19.5523 19.5523 20 19 20C18.8026 20 18.6096 19.9416 18.4453 19.8321L14.1831 18.0754C14.0622 18.0256 13.9327 18 13.802 18H6C4.89543 18 4 17.1046 4 16V6C4 4.89543 4.89543 4 6 4H18ZM15.8911 7.5H15.4067L15.2679 7.50595L15.1448 7.52381C15.0679 7.53969 15.0015 7.5635 14.9454 7.59524L14.869 7.64882L14.7607 7.74864L14.6642 7.84969L13.0317 9.84803L12.9407 9.96753L12.8568 10.0967C12.7765 10.2308 12.7068 10.3794 12.6477 10.5425C12.6149 10.6332 12.5875 10.7254 12.5656 10.8193L12.5369 10.9614L12.5092 11.1791L12.5 11.4024V14.048L12.5092 14.1338L12.5369 14.2148C12.5615 14.2671 12.5985 14.3163 12.6477 14.3622C12.6871 14.3989 12.7287 14.4283 12.7725 14.4504L12.8398 14.478L12.9105 14.4945L12.9844 14.5H15.8911L15.9651 14.4945L16.0585 14.47C16.1189 14.4471 16.1753 14.4112 16.2278 14.3622C16.2607 14.3316 16.288 14.2995 16.3099 14.2661L16.3386 14.2148L16.3663 14.1338L16.3755 14.048V11.3362L16.3696 11.2635L16.3519 11.1951C16.3283 11.129 16.2869 11.0694 16.2278 11.0165C16.195 10.9871 16.1607 10.9626 16.1248 10.943L16.0698 10.9173L15.983 10.8925L15.8911 10.8843H15.3121L15.2549 10.8784L15.2014 10.8608C15.1669 10.8452 15.1349 10.8218 15.1054 10.7906C15.0817 10.7656 15.0666 10.7397 15.06 10.7129L15.0564 10.6722L15.0657 10.63L15.0876 10.5866L16.3992 8.35984L16.446 8.26952L16.483 8.1638C16.5185 8.02478 16.4984 7.89354 16.4228 7.77008C16.3598 7.66719 16.2749 7.5937 16.1682 7.54961L16.084 7.52205L15.9917 7.50551L15.8911 7.5ZM9.96721 7.5H9.54332L9.42195 7.50595L9.31422 7.52381C9.24695 7.53969 9.18878 7.5635 9.1397 7.59524L9.07291 7.64882L8.97814 7.74864L8.89371 7.84969L7.46524 9.84803L7.38563 9.96753L7.28914 10.1419C7.22849 10.264 7.17518 10.3975 7.12923 10.5425C7.10052 10.6332 7.07658 10.7254 7.05744 10.8193L7.03231 10.9614L7.00808 11.1791L7 11.4024V14.048L7.00808 14.1338L7.03231 14.2148C7.05385 14.2671 7.08616 14.3163 7.12923 14.3622C7.1637 14.3989 7.20009 14.4283 7.23841 14.4504L7.29734 14.478L7.35917 14.4945L7.42389 14.5H9.96721L10.0319 14.4945L10.1137 14.47C10.1665 14.4471 10.2159 14.4112 10.2619 14.3622C10.2906 14.3316 10.3145 14.2995 10.3337 14.2661L10.3588 14.2148L10.383 14.1338L10.3911 14.048V11.3362L10.3859 11.2635L10.363 11.1733C10.3415 11.1158 10.3078 11.0636 10.2619 11.0165C10.2331 10.9871 10.2031 10.9626 10.1717 10.943L10.1236 10.9173L10.0477 10.8925L9.96721 10.8843H9.46061L9.41054 10.8784L9.36369 10.8608C9.33353 10.8452 9.30553 10.8218 9.27969 10.7906C9.25901 10.7656 9.24578 10.7397 9.23999 10.7129L9.23688 10.6722L9.24495 10.63L9.26418 10.5866L10.4118 8.35984L10.4527 8.26952L10.4851 8.1638C10.5162 8.02478 10.4986 7.89354 10.4325 7.77008C10.3773 7.66719 10.303 7.5937 10.2096 7.54961L10.136 7.52205L10.0552 7.50551L9.96721 7.5Z" fill="#747474" />
					</svg>
					Logs
				</div>
				<div className={'w-[460px] bg-[#FAFAFA] absolute h-[100vh] overflow-auto right-0 top-0 border-l p-2 shadow-2xl ' + (showAnnotateLogs.value ? 'block' : 'hidden')}>
					<div className={'flex flex-col h-full'}>
						<SmartAnnotateLogs />
						<span onClick={() => tglAnnotateLogs(false)} className={'underline ml-auto mt-auto mr-6 mb-2 cursor-pointer text-[#595959]'}>Hide</span>
					</div>
				</div>
			</div >
		);
	}
}