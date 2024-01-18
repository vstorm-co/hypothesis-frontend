export function MessageData(props) {
    return (
        <div style={{...props.Position}} className={'fixed py-2 px-3 bg-white w-[240px] z-50 rounded border text-xs ' + (props.Visible ? 'block' : 'hidden')}>
            <div className={''}><span className={'font-bold text-[#747474]'}>Model:</span> GPT-4</div>
            <div className={'mt-2'}>
                <span className={'font-bold text-[#747474]'}>Tokens:</span>
                <ul className={'list-disc tokens mt-0.5'}>
                    <li>{props.Message.usage?.prompt_tokens_count} prompt tokens (${props.Message.usage?.prompt_value.toFixed(3)})</li>
                    <li>{props.Message.usage?.completion_tokens_count} completion tokens (${props.Message.usage?.completion_value.toFixed(3)})</li>
                    <li>{props.Message.usage?.total_tokens_count} total tokens (${props.Message.usage?.total_value.toFixed(3)})</li>
                </ul>
            </div>
            {props.Message.elapsed_time &&
                <div className={'mt-2'}><span className={'font-bold text-[#747474]'}>API Time:</span> {props.Message.elapsed_time.toFixed(2)} seconds</div>
            }
        </div>
    )
}
