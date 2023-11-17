export function ReturnResponse(props) {

  return (
    <div className={'relative'}>
      <div className={'border p-1 border-b-0 border-l-0 cursor-pointer rounded-tr border-[#DBDBDB] w-8 h-8 flex items-center justify-center '}>
        <div onClick={() => props.ReturnResponse()} className={'hover:bg-[#F2F2F2]'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 8H14C16.2091 8 18 9.79086 18 12V12C18 14.2091 16.2091 16 14 16H6M6 16L9 13M6 16L9 19" stroke="#747474" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>

  )
}