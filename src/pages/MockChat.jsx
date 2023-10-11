import { useSelector, useDispatch } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import { useState, useEffect, useRef } from 'preact/hooks';
import { route } from 'preact-router';

import { chatsActions, getChatsData, getOrganizationChatsData, updateChat, createChat } from '../store/chats-slice';
import { getOrganizationsData, getUserOrganizationsData } from '../store/organizations-slice';
import { Message } from '../components/Message';
import { Toast } from '../components/Toast';
import { getTemplatesData } from '../store/templates-slice';

import send from '../assets/send.svg';


export function MockChat(props) {
  const chats = useSelector(state => state.chats.chats);
  const user = useSelector(state => state.user.currentUser);

  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const chatRef = useRef(null);

  useEffect(() => {
    if (user.access_token === null) {
      route('/auth')
    }

    // dispatch(getOrganizationsData(user.access_token));
    dispatch(getUserOrganizationsData());
    dispatch(getChatsData());
    dispatch(getTemplatesData());

    // get organization-shared chats

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
      }
    }
  }

  if (chats?.length === 0) {
    const msg = {
      created_by: 'bot',
      content: 'Hello! Create Your First Chat!'
    }
    return (
      <div className={'flex w-full mx-4'}>
        <div>
        </div>
        <div className="mx-auto 2xl:max-w-[1280px] max-w-[860px] w-full">
          <div className="h-[100vh] flex flex-col pt-4 pb-2">
            <div className={'flex justify-between items-center border-b border-[#DBDBDB] relative'}>
              <div className={'text-lg leading-6 font-bold py-5 text-[#595959] '}>
                Welcome!
              </div>

              <div className={'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'}>
                <Toast />
              </div>
            </div>
            <div className="2xl:max-w-[1280px] max-w-[860px] w-full overflow-y-auto" ref={chatRef}>

              <Message Loading={true} Message={msg} />
            </div>
            <form className="mt-auto">
              <textarea onKeyDown={handleKeyDown} onChange={handleInputChange} value={input} className=" w-full h-[156px] bg-[#F2F2F2] border rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6"></textarea>
            </form>
            <div className="flex justify-end items-center mt-2 gap-x-4">
              {/* <button className="text-[#747474] text-sm leading-6 font-bold">Save As Template</button> */}
              <button type="submit" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">Send Message<img className="ml-2" src={send} alt="" /></button>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    const msg = {
      created_by: 'bot',
      content: 'Go on, check your chats!'
    }
    return (
      <div className={'flex w-full mx-4'}>
        <div>
        </div>
        <div className="mx-auto 2xl:max-w-[1280px] max-w-[860px] w-full">
          <div className="h-[100vh] flex flex-col pt-4 pb-2">
            <div className={'flex justify-between items-center border-b border-[#DBDBDB] relative'}>
              <div className={'text-lg leading-6 font-bold py-5 text-[#595959] '}>
                Welcome back!
              </div>

              <div className={'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'}>
                <Toast />
              </div>
            </div>
            <div className="2xl:max-w-[1280px] max-w-[860px] w-full overflow-y-auto" ref={chatRef}>

              <Message Loading={true} Message={msg} />
            </div>
            <form className="mt-auto">
              <textarea onKeyDown={handleKeyDown} onChange={handleInputChange} value={input} className=" w-full h-[156px] bg-[#F2F2F2] border rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6"></textarea>
            </form>
            <div className="flex justify-end items-center mt-2 gap-x-4">
              {/* <button className="text-[#747474] text-sm leading-6 font-bold">Save As Template</button> */}
              <button type="submit" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">Send Message<img className="ml-2" src={send} alt="" /></button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}