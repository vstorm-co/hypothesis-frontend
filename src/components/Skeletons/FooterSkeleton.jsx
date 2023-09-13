export function FooterSkeleton() {
  return (
    <div className={"border-t border-[#747474] px-2 py-4 mt-auto"}>
      <div className={'flex items-center py-1'}>
        <div className={'w-8 h-8 bg-[#595959] rounded-full'}></div>
        <div className={'ml-2'}>
          <div className={'w-48 h-2 bg-[#8F8F8F] rounded'}></div>
          <div className={'w-48 h-2 bg-[#747474] rounded mt-2'}></div>
        </div>
        <div className={'flex ml-auto mr-2'}>
          <div className={'w-4 h-4 bg-[#747474] rounded'}></div>
          <div className={'w-4 h-4 bg-[#747474] rounded ml-2'}></div>
        </div>
      </div>
    </div>
  )
}