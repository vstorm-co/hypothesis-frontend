export function SearchBarSkeleton() {
  return (
    <div className="border-[1px] border-[#747474] rounded-lg flex items-center p-2">
      <div className={'w-4 h-4 bg-[#747474] rounded'}></div>
      <div className={'w-14 h-2 bg-[#747474] ml-2 rounded'}></div>
    </div>
  )
}