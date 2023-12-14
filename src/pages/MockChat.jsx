import { useEffect, useRef } from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { route } from 'preact-router';

import { getChatsData, createChat } from '../store/chats-slice';
import { getUserOrganizationsData } from '../store/user-slice';
import { getTemplatesData } from '../store/templates-slice';
import { Message } from '../components/Message';
import { Toast } from '../components/Toast';

import { PromptInput } from '../components/PromptInput';


export function MockChat(props) {
  const organizationCreated = useSelector(state => state.ui.organizationCreated)
  const user = useSelector(state => state.user.currentUser);

  const dispatch = useDispatch();

  const chatRef = useRef(null);

  useEffect(() => {
    if (user.access_token === null) {
      route('/auth')
    }

    dispatch(getUserOrganizationsData());
    dispatch(getTemplatesData());
    dispatch(getChatsData());
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
    )
  }
}