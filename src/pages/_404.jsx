import { signal } from '@preact/signals';
import { Loading } from '../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/ui-slice';
import { refreshUserToken } from '../store/user-slice';

import docdrop from '../assets/images/docdrop.png';

const loading = signal(false);

function toggleLoading() {
	loading.value = !loading.value;
}

import { Message } from '../components/Message';
import { useEffect } from 'preact/hooks';

export function NotFound() {
	const dispatch = useDispatch();

	dispatch(uiActions.setHideSideBar(true));

	useEffect(() => {

	}, [])

	let messages = [
		{
			created_by: 'bot',
			content: `Looks like page you are looking for **was not found**. [Go here](${window.location.origin}/) `,
		},
	]

	return (
		<div className={'w-full h-[100vh] bg-[#202020]'}>
			<div className={'w-[720px] mx-auto'}>
				<div className={'py-9 flex items-center'}>
					<img src={docdrop} className={'w-6'} alt="" />
					<h1 className={'font-bold ml-2 text-lg leading-6 text-white'}>Docdrop chat</h1>
					<div className={'text-sm leading-6 ml-4 text-[#747474]'}>
						Your Team and AI Everywhere
					</div>
				</div>
				<div className={'px-8 pb-8 bg-white rounded'}>
					<div className={'mx-auto'}>
						<div className={'text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB]'}>
							Oops!
						</div>
						<div className={(loading.value ? 'hidden' : '')}>
							<Message Message={messages[0]} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}