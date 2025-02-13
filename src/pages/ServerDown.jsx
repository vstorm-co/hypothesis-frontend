import { useDispatch } from 'react-redux';
import docdrop from '../assets/images/docdrop.png';
import { uiActions } from '../store/ui-slice';
import { route } from 'preact-router';

export function ServerDown(){
  const dispatch = useDispatch();

  dispatch(uiActions.setHideSideBar(true));

  return (
    <div className={'w-full min-h-[100vh] bg-[#202020]'}>
      <div className={'w-[720px] mx-auto'}>
        <div className={'py-9 flex items-center'}>
            <img src={docdrop} className={'w-6'} alt="" />
            <h1 className={'font-bold ml-2 text-lg leading-6 text-white'}>Docdrop chat</h1>
            <div className={'text-sm leading-6 ml-4 text-[#747474]'}>
              Your Team and AI Everywhere
            </div>
            <div className={'ml-auto mr-2'}>
              <button onClick={() => {route('/auth')}} className={'text-sm leading-6 text-white font-bold'}>
                <span className={'font-bold'}>Log in</span>
              </button>
            </div>
        </div>
        <div className={'px-8 pb-8 bg-white rounded text-[#202020]'}>
          <div className={'mx-auto'}>
            <div className={'text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB]'}>
                Welcome to Docdrop chat
            </div>
            <div className={'text-sm leading-6 mt-4'}>
              Our platform is designed to transform how individuals, teams, and communities interact with each other and with AI to accomplish collective tasks more efficiently. Below are the details of how our platform functions and how we handle data responsibly.
            </div>
            <div className={'mt-4 text-lg leading-6'}>
              <h3 className={'text-[#595959]'}>What Docdrop chat Does With User Data</h3>
              <p className={'mt-4 text-sm leading-6'}>
                <span className={'font-bold'}>Individual Use</span>
                <ul className={'list-disc pl-5'}>
                  <li>Personalized AI Chat: Engage with our AI in one-on-one conversations.</li>
                  <li>Template Creation: Craft and save your custom prompt templates.</li>
                </ul>
              </p>
              <p className={'mt-4 text-sm leading-6'}>
                <span className={'font-bold'}>Collaborative Use</span>
                <ul className={'list-disc pl-5'}>
                  <li>Real-Time Collaboration: Work with teammates in live chat sessions with AI.</li>
                  <li>Joint Template Construction: Create and refine templates together, in real-time.</li>
                  <li>Sharing Capability: Share your templates with others for collaborative use.</li>
                </ul>
              </p>
              <p className={'mt-4 text-sm leading-6'}>
                <span className={'font-bold'}>Team Usage</span>
                <ul className={'list-disc pl-5'}>
                  <li>Content Management: Store and retrieve reference prompts and templates.</li>
                  <li>Discoverability: Search and clone existing templates within your organization.</li>
                </ul>
              </p>
              <p className={'mt-4 text-sm leading-6'}>
                <span className={'font-bold'}>Managerial Use</span>
                <ul className={'list-disc pl-5'}>
                  <li>Oversight: Monitor team usage and direct template application to meet objectives.</li>
                </ul>
              </p>
              <p className={'mt-4 text-sm leading-6'}>
                <span className={'font-bold'}>Community Use</span>
                <ul className={'list-disc pl-5'}>
                  <li>Large-Scale Interaction: Participate in community-wide discussions and template development.</li>
                </ul>
              </p>
              <p className={'mt-4 text-sm leading-6'}>
                <span className={'font-bold'}>Enhanced Functionalities</span>
                <ul className={'list-disc pl-5'}>
                  <li>Google Drive Integration: Securely upload files through authenticated Google Drive sessions.</li>
                  <li>Output Utility: Easily copy AI-generated content in various formats with one click.</li>
                </ul>
              </p>
              <p className={'mt-4 text-sm leading-6'}>
                <span className={'font-bold'}>How Docdrop chat Enhances User Functionality</span>
                <ul className={'list-disc pl-5'}>
                  <li>Real-Time Interaction: Our platform allows for immediate collaboration, enhancing team synergy and productivity.</li>
                  <li>Template System: Save time with reusable prompts, creating consistent and efficient workflows.</li>
                  <li>Search and Discovery: Quickly access past conversations and materials, streamlining learning and task management.</li>
                </ul>
              </p>
            </div>
            <div className={'mt-4 text-lg leading-6'}>
              <h3 className={'text-[#595959]'}>Terms of Use</h3>
              <div className={'text-sm leading-6 mt-4'}>
                By accessing or using Docdrop chat, you agree to abide by our Terms of Use:
                <ul className={'list-disc pl-5 mt-4'}>
                  <li>
                  Compliant Usage: You will use Docdrop chat in full compliance with the laws and regulations applicable to you.
                  </li>
                  <li>Content Responsibility: You are responsible for the content you generate and share on Docdrop chat, ensuring it does not infringe on any laws or third-party rights.</li>
                  <li>Acceptable Use: You agree not to misuse Docdrop chat's services or use them to conduct any unlawful activities.</li>
                  <li>Modification Rights: We reserve the right to change or update these terms at any time. Continuous use of the platform after changes implies acceptance of the new terms.</li>
                </ul>
              </div>
              <div className={'text-sm leading-6 mt-4'}>
                For additional info go to <a target="#blank" className={'underline'} href="https://docdrop.org/privacy/">Privacy Policy & Data Use Transparency</a>
              </div>
              <div className={'text-sm leading-6 mt-4'}>
                Your trust is invaluable to us as we build a platform that fosters open communication and collaboration. Thank you for being a part of Docdrop chat's journey.
              </div>
            </div>
          </div>
        </div>
        <div className={'flex w-full items-center justify-center gap-4 py-2 my-4'}>
          <div className={'text-sm leading-4 text-[#747474]'}>
            © 2024 Docdrop chat
          </div>
          <div className={'text-sm leading-4 text-[#747474]'}>
            All Right Reserved
          </div>
        </div>
      </div>
    </div>
  )
}