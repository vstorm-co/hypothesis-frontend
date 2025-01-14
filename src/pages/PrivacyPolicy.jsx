import { useDispatch } from 'react-redux';
import docdrop from '../assets/images/docdrop.png';
import { uiActions } from '../store/ui-slice';
import { route } from 'preact-router';

export function PrivacyPolicy(){
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
            Privacy Policy & Data Use Transparency
            </div>
            <div className={'mt-4 text-lg leading-6'}>
              <h3 className={'text-[#595959]'}>Privacy Policy</h3>
              <div className={'text-sm leading-6 mt-4'}>
                Your data is your own, and at Docdrop chat, we handle it with the care and respect it deserves. Our Privacy Policy is uncomplicated:
                <ul className={'list-disc pl-5 mt-4'}>
                  <li>
                    Data Collection: We collect only the data necessary to provide you with a fully functional Docdrop chat service.
                  </li>
                  <li>Data Usage: We use your data to support platform functionalities such as chat interactions, template creation, and Google Drive integrations.</li>
                  <li>Data Protection: Using state-of-the-art security measures, we safeguard your data against unauthorized access and data breaches.</li>
                  <li>User Rights: You have the right to access your data, request a correction or deletion, or restrict its usage as per our policy's guidance.</li>
                </ul>
              </div>
            </div>
            <div className={'mt-4 text-lg leading-6'}>
              <h3 className={'text-[#595959]'}>Data Use Transparency</h3>
              <div className={'text-sm leading-6 mt-4'}>
                We’re committed to being open about how we use your data:
                <ul className={'list-disc pl-5 mt-4'}>
                  <li>
                  Google Account Access: Access to your Google account is required strictly for identity verification and enabling Google Drive integration.
                  </li>
                  <li>Purpose-Specific Use: Your data is accessed and used explicitly for providing you with the services of real-time collaboration, template management, and file handling—as described on our platform.</li>
                  <li>No Third-Party Selling: Your data is yours; we never sell it to third parties, nor do we use it for advertising.</li>
                  <li>Docdrop chat use and transfer to any other app of information received from Google APIs will adhere to Google API Services User Data Policy, including the Limited Use requirements.</li>
                </ul>
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