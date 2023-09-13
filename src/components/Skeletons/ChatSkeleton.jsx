export function ChatSkeleton() {
  return (
    <div className={'flex items-center py-2 px-2 mt-2'}>
      <div className={'rounded w-4 h-4 bg-[#747474]'}></div>
      <div className={'rounded h-2 w-36 bg-[#8F8F8F] ml-2'}></div>
      <div className={'rounded h-2 w-16 bg-[#747474] ml-auto'}></div>
    </div>
  )
}