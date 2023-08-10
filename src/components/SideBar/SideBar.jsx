import { SearchBar } from './SearchBar';
import { Chats } from './Chats';
import { Footer } from './Footer/Footer';


export function SideBar() {
  return (
    <div className="bg-[#202020] text-[#FFFFFF]">
      <div className="w-80 h-[100vh] flex flex-col">
        <div className="p-4">
          <SearchBar />
          <Chats />
        </div>
        <Footer />
      </div>
    </div>
  )
}