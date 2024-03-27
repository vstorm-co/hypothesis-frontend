import ReactJson from 'react-json-view';

export function SmartAnnotateLogs() {
  let arr = [
    {
      date: `2024-03-26 12:11:2`,
      api: 'h',
      type: 'Sent',
      bytes: Math.floor(Math.random() * 32),
    },
    {
      date: `2024-03-26 12:11:2`,
      api: 'h',
      type: 'Sent',
      bytes: Math.floor(Math.random() * 32),
    },
    {
      date: `2024-03-26 12:11:2`,
      api: 'o',
      type: 'Sent',
      bytes: Math.floor(Math.random() * 32),
    },
    {
      date: `2024-03-26 12:11:2`,
      api: 'o',
      type: 'Sent',
      bytes: Math.floor(Math.random() * 32),
    },
  ];

  const requestList = arr.map(request =>
    <div>
      <span className={'text-xs cursor-pointer'}></span>
      <div className={'p-0.5 text-xs'}>
        <ReactJson enableClipboard={false} collapsed={true} displayDataTypes={false} displayObjectSize={false} name={`${request.date} ${request.api === 'h' ? 'Hypothesis ' : 'OpenAI '} API-${request.type} ${request.bytes} bytes`} src={request} />
      </div>
    </div>
  );

  return (
    <div>
      {requestList}
    </div>
  )
}