import send from '../assets/send.svg';
import bot from '../assets/bot.svg';
import { useEffect } from 'preact/compat';
import { ToolBar } from '../components/ToolBar/ToolBar';



export function Chat(props) {

	function isChatSelected() {
		// return state.chats.some(chat => chat.selected === true);
	}

	useEffect(() => {
		// dispatch('SELECT_CHAT', +props.params.id);
	}, [props.params.id]);

	return (
		<div className={'flex w-full'}>
			<div>
				{isChatSelected() && <ToolBar />}
			</div>

			<div className="mx-auto">
				<div className="h-[100vh] flex flex-col pt-4 pb-2">
					<div className="max-w-[720px] max-h-[460px] overflow-auto">
						<div className="flex">
							<div className="bg-[#F2F2F2] rounded flex items-center p-2">
								<div className="w-8 h-8 bg-black rounded-full mr-2 text-sm leading-6"></div> <div className="ml-4">How to Log in to app?</div>
							</div>
						</div>
						<div className="flex mt-4">
							<div className="rounded flex p-2">
								<div className="w-8 h-8 border border-[#DBDBDB] rounded-full mr-2 flex items-center justify-center shrink-0"><img src={bot} className="w-4" alt="" /></div>
								<div className="ml-4 mt-1">To log in simply click on 'Google Login' button in the footer of sidebar. Then choose your preffered account.</div>
							</div>
						</div>
					</div>
					<div className="mt-auto">
						<textarea value="Write me a great headline where you take the text “Cryptocurrency is decentralized digital money that’s based on blockchain technology” and" className="w-[720px] h-[156px] bg-[#F2F2F2] border rounded border-[#DBDBDB] focus:outline-none p-4 resize-none text-sm leading-6"></textarea>
					</div>
					<div className="flex justify-end items-center mt-2 gap-x-4">
						<button className="text-[#747474] text-sm leading-6 font-bold">Save As Template</button>
						<button className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">Send Message<img className="ml-2" src={send} alt="" /></button>
					</div>
				</div>
			</div>
		</div>
	);
}