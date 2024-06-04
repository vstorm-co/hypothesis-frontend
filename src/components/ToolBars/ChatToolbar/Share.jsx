// @ts-nocheck
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../../store/ui-slice';

import share from '../../../assets/share.svg';
import { updateChat } from "../../../store/chats-slice.js";

export function Share() {
  const dispatch = useDispatch();
  const currentChat = useSelector(state => state.chats.currentChat);
  const user = useSelector(state => state.user.currentUser);

  function callShowToast() {
    navigator.clipboard.writeText(window.location.href);
    let sharedInfo = !currentChat.share ? 'shared' : 'unshared';

    if (user.user_id != currentChat.owner) {
      dispatch(showToast({ content: `Link copied to clipboard` }))
    } else {
      dispatch(showToast({ content: `Link copied to clipboard` }))

      if (!currentChat.share) {
        dispatch(updateChat({
          uuid: currentChat.uuid,
          organization_uuid: currentChat.organization_uuid,
          visibility: currentChat.visibility,
          share: !currentChat.share
        }));
      }
    }
  }

  return (
    <div className="relative">
      <div onClick={callShowToast} className={'p-1 border border-r-0 rounded-l border-[#DBDBDB] cursor-pointer'}>
        <div className="p-1 relative hover:bg-[#F2F2F2]">
          <img className="w-4" src={share} alt="edit" />
          {(currentChat.share) &&
            <span class="border border-white border-solid inline-block absolute bottom-0 right-0 rounded-full">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 4.5C9 2.01472 6.98528 0 4.5 0C2.01472 0 0 2.01472 0 4.5C0 6.98528 2.01472 9 4.5 9C6.98528 9 9 6.98528 9 4.5ZM4.01647 5.91514C4.17506 5.90928 4.33652 5.90625 4.5 5.90625C4.66356 5.90625 4.82509 5.90929 4.98398 5.91629C4.93123 6.37138 4.85332 6.7843 4.75464 7.1297L4.72127 7.24126L4.68002 7.36592C4.63821 7.48543 4.59485 7.58926 4.55136 7.67544L4.5 7.76756L4.45589 7.68964L4.41246 7.59958C4.35472 7.4718 4.29791 7.31361 4.24536 7.1297C4.14667 6.7843 4.06877 6.37138 4.01647 5.91514ZM1.73212 6.25475L1.63674 6.28757C2.00786 6.88077 2.55821 7.35035 3.21194 7.62049C3.10137 7.28602 3.01376 6.90133 2.94909 6.47836L2.91866 6.26373L2.88861 6.00949C2.50568 6.06116 2.16083 6.13032 1.87186 6.21256L1.73212 6.25475ZM6.08134 6.26373L6.11185 6.00956L6.29373 6.03586C6.71087 6.10032 7.076 6.18609 7.36361 6.28701C6.99249 6.88047 6.442 7.35027 5.78828 7.62043C5.91705 7.23027 6.0148 6.77171 6.08134 6.26373ZM1.20737 3.75369L1.20636 3.76009C1.1531 3.99821 1.125 4.24582 1.125 4.5C1.125 4.7568 1.15368 5.0069 1.20801 5.24727C1.64754 5.08664 2.19884 4.96328 2.81698 4.88392L2.81338 4.67058V4.32942L2.81684 4.11669C2.19884 4.03734 1.64766 3.91401 1.20737 3.75369ZM7.71971 3.77955L7.79211 3.75329C7.84636 3.99349 7.875 4.2434 7.875 4.5C7.875 4.7568 7.84632 5.0069 7.79263 5.24693C7.35234 5.08662 6.80116 4.96328 6.18316 4.88394L6.18662 4.67058L6.1875 4.5C6.1875 4.38573 6.18633 4.27254 6.18398 4.16059L6.18302 4.11671C6.76742 4.04168 7.29207 3.92732 7.71971 3.77955ZM5.05931 4.20798L4.91361 4.2135C4.77714 4.2174 4.63916 4.21937 4.5 4.21937C4.31114 4.21937 4.12443 4.21574 3.94075 4.2086L3.9375 4.5C3.9375 4.59824 3.93858 4.69583 3.9407 4.79259C4.12467 4.78488 4.31126 4.78125 4.5 4.78125C4.68886 4.78125 4.87557 4.78489 5.05925 4.79203L5.0625 4.5L5.05931 4.20798ZM4.45589 1.31036L4.49944 1.23188L4.54411 1.31036L4.58754 1.40042C4.64528 1.5282 4.70209 1.68639 4.75464 1.8703C4.85337 2.21585 4.93129 2.62896 4.98353 3.08548C4.82494 3.09134 4.66348 3.09438 4.5 3.09437C4.33644 3.09437 4.17491 3.09134 4.01596 3.08428C4.06871 2.62896 4.14663 2.21585 4.24536 1.8703C4.31104 1.64041 4.38339 1.45071 4.45589 1.31036ZM3.21172 1.37957L3.1863 1.39022C2.54361 1.66206 2.00265 2.1273 1.63639 2.71299C1.9646 2.82884 2.39476 2.92447 2.88815 2.99107L2.91866 2.73627C2.9852 2.22829 3.08295 1.76973 3.21172 1.37957ZM5.81659 1.46803L5.78806 1.37951L5.93715 1.4454C6.52585 1.72286 7.02138 2.16551 7.36398 2.71368C7.0351 2.82892 6.60486 2.92455 6.11139 2.99113L6.08134 2.73627L6.04833 2.50482C5.98959 2.12519 5.91232 1.77669 5.81659 1.46803Z" fill="#747474"></path>
              </svg>
            </span>
          }
        </div>
      </div>
    </div>
  )
}