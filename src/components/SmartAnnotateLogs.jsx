import { useSignal } from '@preact/signals';
import ReactJson from 'react-json-view';
import { useSelector } from 'react-redux';

export function SmartAnnotateLogs(props) {
  const logs = useSelector(state => state.h.logs);
  const currentChat = useSelector(state => state.chats.currentChat);

  const lastTimeStamp = useSignal(0);

  function generateDate(request) {
    let date = new Date(request.date);

    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();

    let hour = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();

    let target = `${year}-${month < 10 ? `0${month}` : `${month}`}-${day < 10 ? `0${day}` : `${day}`} ${hour < 10 ? `0${hour}` : `${hour}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`
    // let target = `${hour < 10 ? `0${hour}` : `${hour}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`

    return target;
  }

  function getTimeSpent(request, index) {
    if (index === 0) {
      return ""
    }

    if (request.type === 'sent') {
      return ""
    }

    let s = new Date(logs[index - 1].date);
    let r = new Date(request.date)

    var difference = r.getTime() - s.getTime();

    var seconds = difference / 1000;

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    var formattedTime = minutes + "m " + remainingSeconds.toFixed(1) + "s";

    return ` (${formattedTime})`;
  }

  let filteredLogs = logs.filter(l => l.room_id === currentChat.uuid);

  const requestList = filteredLogs.map((request, i) =>
    <div className={'max-w-full break-words'}>
      <div className={'p-0.5 text-xs break-words max-w-full'}>
        <ReactJson enableClipboard={false} collapsed={props.expandLogs ? 4 : true} displayDataTypes={false} displayObjectSize={false} name={`${generateDate(request)} ${request.api} ${request.type}${getTimeSpent(request, i)}`} src={request} />
      </div>
    </div>
  );

  if (logs.length > 0) {
    return (
      <div>
        {requestList}
      </div>
    )
  } else {
    return (
      <div className={'text-[#747474] italic text-sm text-center pt-2'}>
        No logs yet try to start a coversation!
      </div>
    )
  }

}