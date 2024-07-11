// @ts-nocheck
import { useState, useEffect, useRef } from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { signal, useSignal } from '@preact/signals';
import useWebSocket from 'react-use-websocket';
import { route } from 'preact-router'
import { Loading } from '../components/Loading';
import Help from '../assets/help.svg';

import { ChatToolBar } from '../components/ToolBars/ChatToolbar/ChatToolBar';
import { Message } from '../components/Message';
import { Toast } from '../components/Toast';

import { chatsActions, getChatsData, selectChat, updateChat } from '../store/chats-slice';
import { templatesActions } from '../store/templates-slice';

import { PromptInput } from '../components/PromptInput';
import { SmartAnnotateLogs } from '../components/SmartAnnotateLogs';
import { hSliceActions } from '../store/h-slice';
import { HelpToolTip } from '../components/Tooltips/HelpToolTip';
import { ToolbarHelp } from '../components/Tooltips/ToolbarHelp';

const msgLoading = signal(false);
export function Chat(props) {
	const currentChat = useSelector(state => state.chats.currentChat);
	const logs = useSelector(state => state.h.logs);

	const chats = useSelector(state => state.chats.chats);
	const user = useSelector(state => state.user.currentUser);
	const fileUpdating = useSelector(state => state.ui.fileUpdating);
	const showAnnotateLogs = useSelector(state => state.h.showLogs);

	const blockSending = useSignal(false);
	const forceInputFocus = useSignal(0);

	const mousePreviousPosition = useSignal(0);
	const logsWidth = useSignal(420);

	const expandLogs = useSignal(false);

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
		// console.log(e)
	}

	function handleAddEventToResize() {
		window.addEventListener('mousemove', handleResize);
		window.addEventListener('mouseup', removeEventToResize);

		document.querySelector('body').classList.add('select-none', 'cursor-col-resize');
	}

	function removeEventToResize() {
		window.removeEventListener('mousemove', handleResize);
		document.querySelector('body').classList.remove('select-none', 'cursor-col-resize');
		mousePreviousPosition.value = 0;
	}

	function handleResize(e) {
		let body = document.querySelector('body');
		logsWidth.value = body.clientWidth - e.clientX;
	}

	if (!currentChat.uuid) {
		return (
			<div className={'w-full h-[100vh] flex justify-center pt-20'}>
				<Loading />
			</div>
		)
	} else {
		return (
			<div className={'flex w-full'}>
				<div className={'flex w-full mx-4 page-chat'}>
					<div className={'pt-10 ml-4 mr-7 flex flex-col shrink-0'}>
						{activeUsers.value.map(u => (
							<img title={u.user_name} src={u.sender_picture} className="w-8 h-8 border border-[#DBDBDB] rounded-full shrink-0" />
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
								{/* <Message Message={
									{
										created_by: 'annotation',
										content: 'Created **4 annotations** from [urn:x-pdf:dfcbcf206097512065716973265877fc](urn:x-pdf:dfcbcf206097512065716973265877fc), with the prompt: mark random 4 rows',
										content_dict: {
											api_key: '6879-01DzgijfF60WonFSIuAuB59f5OLfL0JdhNMB0mhGLmU',
											annotations: [
												{
													id: '9Il7KifIEe-YrLO8aqlbcw',
													created: '2024-06-11T08:02:32.112991+00:00',
													updated: '2024-06-11T08:02:32.112991+00:00',
													user: 'acct:maciejaroslaw@hypothes.is',
													uri: 'urn:x-pdf:dfcbcf206097512065716973265877fc',
													text: 'Randomly selected row.',
													tags: [],
													group: '__world__',
													permissions: {
														read: [
															'group:__world__'
														],
														admin: [
															'acct:maciejaroslaw@hypothes.is'
														],
														update: [
															'acct:maciejaroslaw@hypothes.is'
														],
														'delete': [
															'acct:maciejaroslaw@hypothes.is'
														]
													},
													target: [
														{
															source: 'urn:x-pdf:dfcbcf206097512065716973265877fc',
															selector: [
																{
																	exact: '38-11-03   1A- 0  MAY.01/99',
																	prefix: 'FEB.01/07        ',
																	suffix: '38-12-01   1F- 0  AUG.01/05',
																	type: 'TextQuoteSelector'
																}
															]
														}
													],
													consumer: '',
													references: [],
													user_info: {
														display_name: null
													},
													links: {
														html: 'https://hypothes.is/a/9Il7KifIEe-YrLO8aqlbcw',
														incontext: 'https://hyp.is/9Il7KifIEe-YrLO8aqlbcw',
														json: 'https://hypothes.is/api/annotations/9Il7KifIEe-YrLO8aqlbcw'
													}
												},
												{
													id: '9Q3g9CfIEe-SKtMqXnQoUg',
													created: '2024-06-11T08:02:32.990948+00:00',
													updated: '2024-06-11T08:02:32.990948+00:00',
													user: 'acct:maciejaroslaw@hypothes.is',
													uri: 'urn:x-pdf:dfcbcf206097512065716973265877fc',
													text: 'Randomly selected row.',
													tags: [],
													group: '__world__',
													permissions: {
														read: [
															'group:__world__'
														],
														admin: [
															'acct:maciejaroslaw@hypothes.is'
														],
														update: [
															'acct:maciejaroslaw@hypothes.is'
														],
														'delete': [
															'acct:maciejaroslaw@hypothes.is'
														]
													},
													target: [
														{
															source: 'urn:x-pdf:dfcbcf206097512065716973265877fc',
															selector: [
																{
																	exact: '38-12-01   1F- 1  FEB.01/07',
																	prefix: '38-12-01   1F- 0  AUG.01/05',
																	suffix: '38-12-01   1F- 2  FEB.01/07',
																	type: 'TextQuoteSelector'
																}
															]
														}
													],
													consumer: '',
													references: [],
													user_info: {
														display_name: null
													},
													links: {
														html: 'https://hypothes.is/a/9Q3g9CfIEe-SKtMqXnQoUg',
														incontext: 'https://hyp.is/9Q3g9CfIEe-SKtMqXnQoUg',
														json: 'https://hypothes.is/api/annotations/9Q3g9CfIEe-SKtMqXnQoUg'
													}
												},
												{
													id: '9Y9uTifIEe-rIyeg8YUIqw',
													created: '2024-06-11T08:02:33.833745+00:00',
													updated: '2024-06-11T08:02:33.833745+00:00',
													user: 'acct:maciejaroslaw@hypothes.is',
													uri: 'urn:x-pdf:dfcbcf206097512065716973265877fc',
													text: 'Randomly selected row.',
													tags: [],
													group: '__world__',
													permissions: {
														read: [
															'group:__world__'
														],
														admin: [
															'acct:maciejaroslaw@hypothes.is'
														],
														update: [
															'acct:maciejaroslaw@hypothes.is'
														],
														'delete': [
															'acct:maciejaroslaw@hypothes.is'
														]
													},
													target: [
														{
															source: 'urn:x-pdf:dfcbcf206097512065716973265877fc',
															selector: [
																{
																	exact: '38-12-01   1K- 0  AUG.01/05',
																	prefix: '38-12-01   1F- 4  FEB.01/07',
																	suffix: '38-12-01   1K- 1  FEB.01/07',
																	type: 'TextQuoteSelector'
																}
															]
														}
													],
													consumer: '',
													references: [],
													user_info: {
														display_name: null
													},
													links: {
														html: 'https://hypothes.is/a/9Y9uTifIEe-rIyeg8YUIqw',
														incontext: 'https://hyp.is/9Y9uTifIEe-rIyeg8YUIqw',
														json: 'https://hypothes.is/api/annotations/9Y9uTifIEe-rIyeg8YUIqw'
													}
												},
												{
													id: '9hijRCfIEe-9zFts-H4g3Q',
													created: '2024-06-11T08:02:34.739403+00:00',
													updated: '2024-06-11T08:02:34.739403+00:00',
													user: 'acct:maciejaroslaw@hypothes.is',
													uri: 'urn:x-pdf:dfcbcf206097512065716973265877fc',
													text: 'Randomly selected row.',
													tags: [],
													group: '__world__',
													permissions: {
														read: [
															'group:__world__'
														],
														admin: [
															'acct:maciejaroslaw@hypothes.is'
														],
														update: [
															'acct:maciejaroslaw@hypothes.is'
														],
														'delete': [
															'acct:maciejaroslaw@hypothes.is'
														]
													},
													target: [
														{
															source: 'urn:x-pdf:dfcbcf206097512065716973265877fc',
															selector: [
																{
																	exact: '38-12-01   1K- 2  FEB.01/07',
																	prefix: '38-12-01   1K- 1  FEB.01/07',
																	suffix: '38-12-01   1K- 3  FEB.01/07',
																	type: 'TextQuoteSelector'
																}
															]
														}
													],
													consumer: '',
													references: [],
													user_info: {
														display_name: null
													},
													links: {
														html: 'https://hypothes.is/a/9hijRCfIEe-9zFts-H4g3Q',
														incontext: 'https://hyp.is/9hijRCfIEe-9zFts-H4g3Q',
														json: 'https://hypothes.is/api/annotations/9hijRCfIEe-9zFts-H4g3Q'
													}
												}
											],
											url: 'https://hyp.is/9hijRCfIEe-9zFts-H4g3Q',
											prompt: 'mark random 4 rows',
											group_id: '__world__',
											selectors: [
												{
													exact: '38-11-03   1A- 0  MAY.01/99',
													prefix: 'FEB.01/07        ',
													suffix: '38-12-01   1F- 0  AUG.01/05',
													annotation: 'Randomly selected row.'
												},
												{
													exact: '38-12-01   1F- 1  FEB.01/07',
													prefix: '38-12-01   1F- 0  AUG.01/05',
													suffix: '38-12-01   1F- 2  FEB.01/07',
													annotation: 'Randomly selected row.'
												},
												{
													exact: '38-12-01   1K- 0  AUG.01/05',
													prefix: '38-12-01   1F- 4  FEB.01/07',
													suffix: '38-12-01   1K- 1  FEB.01/07',
													annotation: 'Randomly selected row.'
												},
												{
													exact: '38-12-01   1K- 2  FEB.01/07',
													prefix: '38-12-01   1K- 1  FEB.01/07',
													suffix: '38-12-01   1K- 3  FEB.01/07',
													annotation: 'Randomly selected row.'
												}
											]
										}
									}
								} /> */}
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
									SubmitButtonText={(blockSending.value ? 'Stop Generating' : 'Send Prompt')}
									handleSubmitButton={(value) => { handleSubmitButton(value) }}
									SecondButton={false}
									SecondButtonText={''}
									handleSecondButton={() => { }}
									WSsendMessage={value => { sendMessage(value) }}

									clearInputOnSubmit={true}
									forceFocus={forceInputFocus.value}
								/>
								<div className={'absolute bottom-0 text-[#747474] text-xs self-start py-2'}>
									<ToolbarHelp onChat={true} />
									{fileUpdating &&
										<div className={'text-[#EF4444]'}>
											Papaya is refreshing content of file included in this prompt. It may take some time to complete this process
										</div>
									}
									<div className={''}>
										{WhosTyping.value.map(u => (
											<span>{u.name} </span>
										))}
										{false > 0 &&
											<span>

												is typing...
											</span>
										}
									</div>
								</div>
							</div>
						</div>
					</div>

				</div >
				<div style={{ width: `${logsWidth.value}px` }} className={'bg-[#EBEBEB] h-[100vh] max-w-[600px] min-w-[320px] shrink-0 overflow-y-auto border-l relative p-1 ' + (showAnnotateLogs ? 'block' : 'hidden')}>
					<div className={'flex flex-col h-full ' + (logs.length > 0 ? 'pt-8' : '')}>
						<div onClick={() => expandLogs.value = !expandLogs.value} className={'bg-white px-2 py-1 rounded absolute top-2 right-2 cursor-pointer z-50 ' + (logs.length > 0 ? 'block' : 'hidden')}>
							{expandLogs.value &&
								<div className={'flex items-center gap-1 text-sm'}>
									<svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd" d="M15.7903 1.6129C16.0953 1.22061 16.0676 0.653377 15.7071 0.292893C15.3166 -0.0976311 14.6834 -0.0976311 14.2929 0.292893L11 3.584V2L10.9933 1.88338C10.9355 1.38604 10.5128 1 10 1C9.44771 1 9 1.44772 9 2V6L9.00673 6.11662C9.06449 6.61396 9.48716 7 10 7H14L14.1166 6.99327C14.614 6.93551 15 6.51284 15 6L14.9933 5.88338C14.9355 5.38604 14.5128 5 14 5H12.414L15.7071 1.70711L15.7903 1.6129ZM6.99327 9.88338C6.93551 9.38604 6.51284 9 6 9H2L1.88338 9.00673C1.38604 9.06449 1 9.48716 1 10L1.00673 10.1166C1.06449 10.614 1.48716 11 2 11H3.584L0.292893 14.2929L0.209705 14.3871C-0.0953203 14.7794 -0.0675907 15.3466 0.292893 15.7071C0.683418 16.0976 1.31658 16.0976 1.70711 15.7071L5 12.414V14L5.00673 14.1166C5.06449 14.614 5.48716 15 6 15C6.55228 15 7 14.5523 7 14V10L6.99327 9.88338Z" fill="currentColor" />
									</svg>
									Collapse All
								</div>
							}
							{!expandLogs.value &&
								<div className={'flex items-center gap-1 text-sm'}>
									<svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd" d="M15.9933 0.883379C15.9355 0.38604 15.5128 0 15 0H11L10.8834 0.00672773C10.386 0.0644928 10 0.487164 10 1L10.0067 1.11662C10.0645 1.61396 10.4872 2 11 2H12.584L9.29289 5.29289L9.2097 5.3871C8.90468 5.77939 8.93241 6.34662 9.29289 6.70711C9.68342 7.09763 10.3166 7.09763 10.7071 6.70711L14 3.414V5L14.0067 5.11662C14.0645 5.61396 14.4872 6 15 6C15.5523 6 16 5.55228 16 5V1L15.9933 0.883379ZM6.7903 10.6129C7.09532 10.2206 7.06759 9.65338 6.70711 9.29289C6.31658 8.90237 5.68342 8.90237 5.29289 9.29289L2 12.584V11L1.99327 10.8834C1.93551 10.386 1.51284 10 1 10C0.447715 10 0 10.4477 0 11V15L0.00672773 15.1166C0.0644928 15.614 0.487164 16 1 16H5L5.11662 15.9933C5.61396 15.9355 6 15.5128 6 15L5.99327 14.8834C5.93551 14.386 5.51284 14 5 14H3.414L6.70711 10.7071L6.7903 10.6129Z" fill="currentColor" />
									</svg>
									Expand All
								</div>
							}
						</div>
						<span onMouseDown={handleAddEventToResize} className={'block absolute top-0 -left-2 w-3 h-full bg-[#595959] opacity-20 hover:opacity-75 z-51 cursor-col-resize'}></span>
						<SmartAnnotateLogs expandLogs={expandLogs.value} />
					</div>
				</div>
			</div>
		);
	}
}