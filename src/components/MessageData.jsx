import { useSelector } from "react-redux";

export function MessageData(props) {
    function timestamp() {
        let time = new Date(props.Message.created_at).toUTCString()
        return time;
    }

    const currentChat = useSelector(state => state.chats.currentChat)

    return (
        <div style={{ ...props.Position }} className={'fixed py-2 px-3 bg-white w-[240px] z-50 rounded border text-xs ' + (props.Visible ? 'block' : 'hidden')}>
            <div className={''}><span className={'font-bold text-[#747474]'}>Model:</span> {currentChat?.model_name}</div>
            <div title={timestamp()} className={'mt-0.5'}><span className={'font-bold text-[#747474]'}>Timestamp:</span> {timestamp()}</div>
            <div className={'mt-2'}>
                <span className={'font-bold text-[#747474]'}>Tokens:</span>
                {props.Message.usage &&
                    <ul className={'list-disc tokens mt-0.5 pl-5'}>
                        <li>{props.Message.usage?.prompt_tokens_count} prompt tokens (${props.Message.usage.prompt_value?.toFixed(3)})</li>
                        <li>{props.Message.usage?.completion_tokens_count} completion tokens (${props.Message.usage.completion_value?.toFixed(3)})</li>
                        <li>{props.Message.usage?.total_tokens_count} total tokens (${props.Message.usage.total_value?.toFixed(3)})</li>
                    </ul>
                }
            </div>
            {props.Message.elapsed_time &&
                <div className={'mt-2'}><span className={'font-bold text-[#747474]'}>API Time:</span> {props.Message.elapsed_time.toFixed(2)} seconds</div>
            }
        </div>
    )
}
