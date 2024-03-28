import ReactJson from 'react-json-view';
import { useSelector } from 'react-redux';

export function SmartAnnotateLogs() {
  const logs = useSelector(state => state.h.logs)

  function generateDate(dateString) {
    let date = new Date(dateString);

    let year = date.getUTCFullYear();
    let month = date.getUTCMonth();
    let day = date.getUTCDate();

    let hour = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();

    let target = `${year}-${month < 10 ? `0${month}` : `${month}`}-${day < 10 ? `0${day}` : `${day}`} ${hour < 10 ? `0${hour}` : `${hour}`} ${minutes < 10 ? `0${minutes}` : `${minutes}`} ${seconds < 10 ? `0${seconds}` : `${seconds}`}`

    return target;
  }

  const requestList = logs.map(request =>
    <div>
      <span className={'text-xs cursor-pointer'}></span>
      <div className={'p-0.5 text-xs'}>
        <ReactJson enableClipboard={false} collapsed={true} displayDataTypes={false} displayObjectSize={false} name={`${generateDate(request.date)} ${request.api} ${request.type}`} src={request} />
      </div>
    </div>
  );

  return (
    <div>
      {requestList}
    </div>
  )
}