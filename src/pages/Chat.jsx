import send from '../assets/send.svg';
import bot from '../assets/bot.svg';
import { useEffect } from 'preact/compat';
import { useStore } from '../state/store';
import { ToolBar } from '../components/ToolBar/ToolBar';



export function Chat(props) {
	const [state, dispatch] = useStore();

	function isChatSelected() {
		return state.chats.some(chat => chat.selected === true);
	}

	useEffect(() => {
		dispatch('SELECT_CHAT', +props.params.id);
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
								<div className="w-8 h-8 bg-black rounded-full mr-2 text-sm leading-6"></div> <div className="ml-4">Can you explain what’s happening in Hamlet?</div>
							</div>
						</div>
						<div className="flex mt-4">
							<div className="rounded flex p-2">
								<div className="w-8 h-8 border border-[#DBDBDB] rounded-full mr-2 flex items-center justify-center shrink-0"><img src={bot} className="w-4" alt="" /></div>
								<div className="ml-4">This passage is from Act I, Scene I of Shakespeare's play "Hamlet," where Francisco, a soldier, is standing guard outside the castle of Elsinore. He is approached by Bernardo, another soldier, who takes over the watch and questions why the guard duty is so strict and why there is so much military activity, including the casting of cannons and the hiring of shipwrights. Bernardo is essentially asking why there is so much military preparation and activity going on in the land, including the nightly watch and the constant casting of cannons. He wonders why shipwrights are being employed, and why they are working non-stop, even on Sundays. Bernardo is seeking information about what might be happening in the land, and what the cause of this intense military activity might be. He is looking for someone who can inform him about the situation and shed some light on why there is so much preparation and urgency in the air.</div>
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