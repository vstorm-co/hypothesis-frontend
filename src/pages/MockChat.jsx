import { useEffect, useRef } from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { route } from 'preact-router';

import { getChatsData, createChat } from '../store/chats-slice';
import { getUserOrganizationsData } from '../store/user-slice';
import { getTemplatesData } from '../store/templates-slice';
import { Message } from '../components/Message';
import { Toast } from '../components/Toast';

import { PromptInput } from '../components/PromptInput';
import { SmartAnnotateLogs } from '../components/SmartAnnotateLogs';


export function MockChat(props) {
  const organizationCreated = useSelector(state => state.ui.organizationCreated)
  const user = useSelector(state => state.user.currentUser);
  const showAnnotateLogs = useSelector(state => state.h.showLogs);


  const dispatch = useDispatch();

  const chatRef = useRef(null);

  useEffect(() => {
    if (user.access_token === null) {
      route('/auth')
    }
  }, [user])


  function callCreateChat(value) {
    localStorage.setItem("ANT_PromptsToSend", JSON.stringify(value));
    dispatch(createChat("New Chat"));
  }


  if (organizationCreated && organizationCreated.created) {
    const msgs = [
      {
        created_by: 'bot',
        content: `Welcome to Papaya! You are the first user at **${user.organization_name}** and you’ve kicked off a new era of AI powered collaboration. Here’s how you can get started building AI powered workflows with your team: 
   
  - You can begin by assigning the AI a job to do, in the text box below. Our AI will retain context from your interactions over time to help better serve you.
  - When you have built a prompt that meets your needs, you can save it in your prompt repository and share it with your team, the rest of your company or the world.
  `
      },
      {
        created_by: 'bot',
        content: `Prompts are better when you build them together, try inviting a teammate to your AI chat using the button below. Now you can collaborate with AI and your team together.`
      },
      {
        created_by: 'bot',
        content: `Quickly share your prompt by sharing link at the top of the page.`
      },
    ]
    return (
      <div className={'flex w-full mx-4'}>
        <div className={'pt-10 pl-4 mr-7 flex flex-col'}>
          <img className="w-8 h-8 border border-[#DBDBDB] rounded-full invisible" />
        </div>
        <div className="mx-auto 2xl:max-w-[1280px] max-w-[860px] w-full">
          <div className="h-[100vh] flex flex-col pt-4 pb-2">
            <div className={'flex justify-between items-center border-b border-[#DBDBDB] relative'}>
              <div className={'text-lg leading-6 font-bold py-5 text-[#595959] '}>
                Welcome to Papaya
              </div>

              <div className={'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'}>
                <Toast />
              </div>
            </div>
            <div className="2xl:max-w-[1280px] max-w-[860px] w-full overflow-y-auto" ref={chatRef}>

              <Message Loading={true} Message={msgs[0]} />
              <Message Loading={true} Message={msgs[1]} />
              <Message Loading={true} Message={msgs[2]} />
            </div>
            <PromptInput
              Icon={'send'}
              blockSending={false}
              WSsendMessage={() => { }}
              SubmitButtonText={'Send Message'}
              handleSubmitButton={(value) => { callCreateChat(value.promptArray) }}
              SecondButton={true}
            />
          </div>
        </div>
      </div>
    )
  } else {
    const msg = {
      created_by: 'bot',
      content: 'Go on, to start a new chat just send prompt!'
    }
    return (
      <div className={'flex w-full page-start'}>
        <div className={'flex w-full mx-4'}>
          <div className={'pt-10 pl-4 mr-7 flex flex-col'}>
            <img className="w-8 h-8 border border-[#DBDBDB] rounded-full invisible" />
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
              <PromptInput
                Icon={'send'}
                blockSending={false}
                WSsendMessage={() => { }}
                SubmitButtonText={'Send Message'}
                handleSubmitButton={(value) => { callCreateChat(value.promptArray) }}
                SecondButton={true}
              />
            </div>
          </div>
        </div>
        <div className={'w-[460px] bg-[#EBEBEB] h-[100vh] overflow-auto border-l relative p-1 ' + (showAnnotateLogs ? 'block' : 'hidden')}>
          <div className={'flex flex-col h-full'}>
            {/* <div className={'bg-white px-2 py-1 rounded absolute top-2 right-2 cursor-pointer'}>
              {true &&
                <div className={'flex items-center gap-1 text-sm'}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7903 1.6129C16.0953 1.22061 16.0676 0.653377 15.7071 0.292893C15.3166 -0.0976311 14.6834 -0.0976311 14.2929 0.292893L11 3.584V2L10.9933 1.88338C10.9355 1.38604 10.5128 1 10 1C9.44771 1 9 1.44772 9 2V6L9.00673 6.11662C9.06449 6.61396 9.48716 7 10 7H14L14.1166 6.99327C14.614 6.93551 15 6.51284 15 6L14.9933 5.88338C14.9355 5.38604 14.5128 5 14 5H12.414L15.7071 1.70711L15.7903 1.6129ZM6.99327 9.88338C6.93551 9.38604 6.51284 9 6 9H2L1.88338 9.00673C1.38604 9.06449 1 9.48716 1 10L1.00673 10.1166C1.06449 10.614 1.48716 11 2 11H3.584L0.292893 14.2929L0.209705 14.3871C-0.0953203 14.7794 -0.0675907 15.3466 0.292893 15.7071C0.683418 16.0976 1.31658 16.0976 1.70711 15.7071L5 12.414V14L5.00673 14.1166C5.06449 14.614 5.48716 15 6 15C6.55228 15 7 14.5523 7 14V10L6.99327 9.88338Z" fill="currentColor" />
                  </svg>
                  Collapse
                </div>
              }
            </div> */}
            <SmartAnnotateLogs />
          </div>
        </div>
      </div>
    )
  }
}