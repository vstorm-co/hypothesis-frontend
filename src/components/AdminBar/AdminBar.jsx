import { useStore } from '../../state/store';


export function AdminBar() {
  const state = useStore()[0];
  return (
    <div className="bg-[#202020] text-[#FFFFFF] ml-8">
      <div className={"h-[100vh] flex flex-col duration-300 " + (state.showAdminBar ? 'w-80' : 'w-0')}>
        <div class="p-4">
          <div className="flex items-center py-3 px-2">
            <div className="w-8 h-8 bg-white rounded-full mr-2"></div>
            <div className="text-sm leading-6">
              Jared Pendergraft
            </div>
          </div>
          <div className="flex items-center py-3 px-2">
            <div className="w-8 h-8 bg-white rounded-full mr-2"></div>
            <div className="text-sm leading-6">
              Jared Pendergraft
            </div>
          </div>
          <div className="flex items-center py-3 px-2">
            <div className="w-8 h-8 bg-white rounded-full mr-2"></div>
            <div className="text-sm leading-6">
              Jared Pendergraft
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}