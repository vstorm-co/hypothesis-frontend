import loopSvg from '../../assets/loop.svg';

export function SearchBar() {
  return (
    <div className="border-[1px] border-[#747474] rounded-lg flex items-center p-2">
      <img className="w-4" src={loopSvg} alt="" />
      <input type="text" className="bg-transparent placeholder:text-[#747474] focus:outline-none ml-2" placeholder="Search..." />
    </div>
  )
}