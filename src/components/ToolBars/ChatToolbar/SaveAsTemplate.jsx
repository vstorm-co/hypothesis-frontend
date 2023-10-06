import braces from '../../../assets/braces.svg';

export function SaveAsTemplate() {
  return (
    <div className={'relative'}>
      <div className={'p-2 border rounded'}>
        <img src={braces} alt="" />
      </div>
      <div className={"absolute z-50 border rounded right-0 top-10 bg-white " + (false ? '' : 'hidden')}>
        <div className="border-b p-2">
          <div className="text-xs font-bold text-[#747474] mb-1">
            Title
          </div>
          <input type="text" className="bg-[#F2F2F2] border border-[#DBDBDB] rounded focus:outline-none p-2" />
          <div className={'text-[10px] mt-0.5 text-right text-[#747474]'}>
            press 'Enter' to confirm
          </div>
        </div>
      </div>
    </div>
  )
}