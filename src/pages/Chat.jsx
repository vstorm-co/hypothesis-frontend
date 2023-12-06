// @ts-nocheck
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

const msgLoading = signal(false);
export function Chat(props) {
	const currentChat = useSelector(state => state.chats.currentChat);
	const chats = useSelector(state => state.chats.chats);
	const templates = useSelector(state => state.templates.useTemplates);
	const user = useSelector(state => state.user.currentUser);

	const useTemplateVisible = useSignal(false);
	const blockSending = useSignal(false);
	const activeUsers = useSignal([]);
	const promptsLeft = useSignal([]);
	const WhosTyping = useSignal([]);
	const preview = useSignal('');
	const caret = useSignal();

	const input = useRef('');
	const [text, setText] = useState('');

	const [editTitle, setEditTitle] = useState(false);
	const titleInputRef = useRef(null);

	const [promptMode, setPromptMode] = useState('write');

	const dispatch = useDispatch();

	const chatRef = useRef();
	const chatInputRef = useRef();

	useEffect(() => {
		dispatch(selectChat(props.matches.id));

		dispatch(getUserOrganizationsData());
		dispatch(getChatsData(props.matches.id));
		dispatch(getTemplatesData());

		// get organization-shared chats
	}, [user])

	useEffect(() => {
		setText('');
		setTimeout(() => {
			setRange();
		}, 100)
	}, [currentChat.uuid])

	useEffect(() => {
		if (user.access_token === null) {
			route('/auth');
			localStorage.setItem("redirect_to_chat", props.matches.id);
		}

		setTimeout(() => {
			chatRef.current.scrollTop = chatRef.current.scrollHeight
		}, 300);
	}, [currentChat.messages])

	function saveCaret() {
		let range = window.getSelection().getRangeAt(0);

		caret.value = range;
	}

	function setRange() {
		const range = document.createRange();
		const sel = window.getSelection();
		range.selectNodeContents(chatInputRef.current);
		range.collapse(false);
		sel.removeAllRanges();
		sel.addRange(range);
		chatInputRef.current.focus();
		range.detach();

		saveCaret();
	}

	function handleKeyDown(event) {
		sendMessage(JSON.stringify({ type: 'user_typing', user: user.email }))
		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
			sendMsg();
		}
	}
	const { sendMessage } = useWebSocket(`${import.meta.env.VITE_WS_URL}/${props.matches.id}?token=${user.access_token}`, {

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
				blockSending.value = false;
				msgLoading.value = false;

				if (promptsLeft.value.length > 0) {
					dispatch(chatsActions.addMessage({ created_by: "user", sender_picture: user.picture, content: promptsLeft.value[0].prompt, content_html: promptsLeft.value[0].html }));

					sendMessage(JSON.stringify({ type: 'message', content: promptsLeft.value[0].prompt, content_html: promptsLeft.value[0].html }));
					promptsLeft.value.shift();
				}
			}

			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	})

	const generatePreview = () => {
		const parser = new DOMParser();
		const htmlText = parser.parseFromString(text, 'text/html');

		let currentTemplates = htmlText.querySelectorAll('span');

		let targetPreview = text;

		currentTemplates.forEach(temp => {
			if (temp.dataset.content) {
				let templateTarget = templates.find(t => t.uuid === temp.dataset.content);
				targetPreview = targetPreview.replace(temp.outerHTML, templateTarget.content)
			}
		});

		preview.value = targetPreview;
	}

	const sendMsg = () => {
		if (text.length > 0 && !blockSending.value) {
			const parser = new DOMParser();
			const htmlText = parser.parseFromString(text, 'text/html');

			let currentTemplates = htmlText.querySelectorAll('span');

			let targetPreview = text;
			let htmlPreview = '';

			currentTemplates.forEach(temp => {
				if (temp.dataset.content) {
					let templateTarget = templates.find(t => t.uuid === temp.dataset.content);
					htmlPreview = templateTarget.content_html;
					targetPreview = targetPreview.replace(temp.outerHTML, templateTarget.content)
				}
			});

			let promptArray = targetPreview.split(`<div contenteditable="false" class="return-box px-1.5 rounded"></div>`);
			let htmlArray = htmlPreview.split(`<div contenteditable="false" class="return-box px-1.5 rounded"></div>`);

			if (promptArray.length === htmlArray.length) {
				promptArray = promptArray.map((p, index) => {
					return {
						prompt: p.replace("&nbsp;", "").replace("<br>", "").replace(/(<([^>]+)>)/gi, "").trim(),
						html: promptArray.length > 1 ? htmlArray[index].replace("&nbsp;", "").replace("<br>", "").replace("\n", "") : text,
					};
				});
			} else {
				promptArray = promptArray.map((p, index) => {
					return {
						prompt: p.replace("&nbsp;", "").replace("<br>", "").replace(/(<([^>]+)>)/gi, "").trim(),
						html: p.replace("&nbsp;", "").replace("<br>", "").replace(/(<([^>]+)>)/gi, "").trim(),
					};
				});
			}


			console.log(promptArray);

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
			}, 100);
			setText('');
			msgLoading.value = true;
		}
	}

	function handleUseTemplate(template) {
		let element = document.createElement('span');
		element.innerText = `${template.name}`;
		element.dataset.content = `${template.uuid}`;
		element.classList.add('pill');
		element.setAttribute("contenteditable", false);

		caret.value.insertNode(element);

		// Move the caret after the inserted element
		caret.value.setStartAfter(element);
		caret.value.setEndAfter(element);

		setTimeout(() => {
			// setRange();
			setText(`${chatInputRef.current.innerHTML}`);
			useTemplateVisible.value = false;
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

	function handleOnInput(e) {
		let currentText = e.currentTarget.innerHTML
		setText(currentText);
		saveCaret();
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

	function handleToggleVisible(tgl) {
		if (tgl != undefined) {
			useTemplateVisible.value = tgl;
		} else {
			useTemplateVisible.value = !useTemplateVisible.value;
		}
		if (useTemplateVisible) {
			chatInputRef.current.focus();
		}
	}

	let MockMessage = {
		created_by: 'bot',
		content: chats?.length > 1 ?
			`Welcome ${user.name?.split(" ")[0]}, start this chat by entering a prompt below.`
			:
			`Welcome ${user.name?.split(" ")[0]}, start your first chat with me by entering a prompt below.`,
	}

	return (
		<div className={'flex w-full mx-4'}>
			<div className={'pt-10 pl-4 mr-7 flex flex-col'}>
				{activeUsers.value.map(u => (
					<img title={u.user_name} src={u.sender_picture} className="w-8 h-8 border border-[#DBDBDB] rounded-full" />
				))}
				<img className="w-8 h-8 border border-[#DBDBDB] rounded-full invisible" />
			</div>
			<div className="mx-auto 2xl:max-w-[1280px] max-w-[860px] w-full">
				<div className="h-[100vh] flex flex-col pt-4 pb-2">
					<div className={'flex items-center py-3 border-b border-[#DBDBDB] relative'}>
						<div onClick={() => { handleTitleInputClick() }} class="flex items-center w-full max-w-[570px] cursor-pointer">
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
								<div className={'text-[10px] mt-0.5 -mb-3 text-right text-[#747474]'}>
									press 'Enter' to confirm
								</div>
							</div>
						</div>

						<div className={'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'}>
							<Toast />
						</div>

						<div className={'ml-auto text-xs text-[#747474] shrink-0'}>
							{EditedAt()}
						</div>
						<div className={'ml-5 shrink-0'}>
							<ChatToolBar />
						</div>
					</div>
					<div className="2xl:max-w-[1280px] max-w-[860px] w-full h-full overflow-y-auto pb-4" ref={chatRef}>
						{currentChat.messages?.length === 0 &&
							<div>
								<Message Message={MockMessage} />
							</div>
						}
						{currentChat.messages?.map(msg => (
							<Message Message={msg} />
						))}
					</div>
					<form onSubmit={() => { sendMsg() }} className="mt-auto shrink-0">
						{templates?.length > 0 &&
							<div className={'flex'}>
								<UseTemplate Visible={useTemplateVisible.value} onToggleVisible={handleToggleVisible} Position={'top'} TemplatePicked={handleUseTemplate} />

								<div className={'ml-auto flex items-center justify-center'}>
									<div onClick={() => { setPromptMode('write') }} className={'px-4 text-sm leading-6 font-bold cursor-pointer py-1 border-[#DBDBDB] border-b-0 border-b-white -mb-[1px] rounded-t ' + (promptMode === 'write' ? 'border bg-[#FAFAFA]' : '')}>
										Write
									</div>
									<div onClick={() => { setPromptMode('preview'); generatePreview(); }} className={'px-4 text-sm leading-6 font-bold cursor-pointer py-1 -mb-[1px] border-[#DBDBDB] border-b-0 rounded-t ' + (promptMode === 'preview' ? 'border bg-white' : '')}>
										Preview
									</div>
								</div>
							</div>}
						{promptMode === 'write' &&
							<div data-placeholder={blockSending.value ? 'Processing...' : 'Enter a prompt...'} spellCheck={false} ref={chatInputRef} contentEditable={true} onKeyDown={handleKeyDown} onClick={() => saveCaret()} onInput={e => handleOnInput(e)} dangerouslySetInnerHTML={{ __html: text }} className={"msg whitespace-pre-wrap write-box w-full min-h-[72px] max-h-[156px] bg-[#FAFAFA] border overflow-auto rounded-tl-none rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6"}>
								{text}
							</div>}
						{promptMode === 'preview' &&
							<div spellCheck={false} dangerouslySetInnerHTML={{ __html: preview.value }} className="msg w-full min-h-[72px] max-h-[156px] preview-box bg-white border overflow-auto rounded-t-none rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6">
								{preview.value}
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
						<div className={'flex gap-4'}>
							<button type="submit" disabled={text.length === 0 || blockSending.value} onClick={() => { sendMsg(); }} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">Send Message<img className="ml-2" src={send} alt="" /></button>
						</div>
					</div>
				</div>
			</div>
		</div >
	);
}