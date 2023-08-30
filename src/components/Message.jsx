import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'preact/hooks'



export function Message() {
  const dispatch = useDispatch();

  return (
    <div className="flex">
      <div className="bg-[#F2F2F2] rounded flex items-center p-2">
        <div className="w-8 h-8 bg-black rounded-full mr-2 text-sm leading-6"></div> <div className="ml-4">How to Log in to app?</div>
      </div>
    </div>
  )

  // <div className="flex mt-4">
  //   <div className="rounded flex p-2">
  //     <div className="w-8 h-8 border border-[#DBDBDB] rounded-full mr-2 flex items-center justify-center shrink-0"><img src={bot} className="w-4" alt="" /></div>
  //     <div className="ml-4 mt-1">To log in simply click on 'Google Login' button in the footer of sidebar. Then choose your preffered account.</div>
  //   </div>
  // </div>
}