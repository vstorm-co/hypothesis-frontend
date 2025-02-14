import { route } from 'preact-router';
import { useDispatch, useSelector } from 'react-redux';
import { templatesActions } from '../../store/templates-slice';
import { chatsActions } from '../../store/chats-slice';
import { selectTemplate } from '../../store/templates-slice';

import braces from '../../assets/braces.svg'
import { uiActions } from '../../store/ui-slice';

export function TemplateBar(props) {
  const dispatch = useDispatch();
  const currentTemplate = useSelector(state => state.templates.currentTemplate);

  const callSelectTemplate = () => {
    let width = window.innerWidth;
    if (width < 960) {
      dispatch(uiActions.setExpandSideBar(false));
    }
    dispatch(chatsActions.setCurrentChat({ uuid: null }));


    dispatch(selectTemplate(props.TemplateData.uuid));
    route(`/templates/${props.TemplateData.uuid}`);

  }

  function isSelected() {
    return props.TemplateData.uuid === currentTemplate.uuid
  }

  function EditedAt() {
    const updatedAt = new Date(props.TemplateData.updated_at ? props.TemplateData.updated_at : props.TemplateData.created_at);
    const today = new Date();

    // const diffrence = Math.floor((today.getTime() - updatedAt.getTime()) / (1000 * 3600 * 24));
    var hours = Math.floor(Math.abs(today - updatedAt) / 36e5);
    // var hours = Math.floor(12 * 24);

    if (hours === 0) {
      return 'Just now';
    }

    if (hours < 24) {
      return `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`
    } else if (hours >= 24 && hours < 7 * 24) {
      let days = Math.floor(hours / 24);
      return `${days} ${days > 1 ? 'days' : 'day'} ago`
    } else if (hours >= 7 * 24) {
      let weeks = Math.floor((hours / 24) / 7)
      return `${weeks} ${weeks > 1 ? 'weeks' : 'week'} ago`
    }
  }

  return (
    <div onClick={(e) => { e.stopPropagation(); callSelectTemplate() }} className={"flex items-center bg-[#202020] py-2 px-2 rounded cursor-pointer " + (isSelected() ? 'bg-[#747474]' : 'hover:bg-[#0F0F0F]')}>
      <div className={'w-4 ' + (isSelected() ? 'text-[#DBDBDB]' : 'text-[#747474]')}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 13.5C8 13.7761 8.22386 14 8.5 14H9.23047C11.4453 14 12.1836 13.294 12.1836 11.1831V9.63691C12.1836 8.65221 12.4797 8.28984 13.5021 8.21308C13.7774 8.1924 14.002 7.97281 14.002 7.69667V6.31039C14.002 6.03425 13.7774 5.81466 13.5021 5.79398C12.4797 5.71722 12.1836 5.35485 12.1836 4.37015V2.81694C12.1836 0.706001 11.4453 0 9.23047 0H8.5C8.22386 0 8 0.223858 8 0.5V1.4062C8 1.68235 8.22386 1.9062 8.5 1.9062H8.58789C9.51074 1.9062 9.69531 2.13212 9.69531 3.25466V5.27383C9.69531 6.22693 10.3379 6.83409 11.4521 6.93293V7.07413C10.3379 7.17297 9.69531 7.78013 9.69531 8.73323V10.7453C9.69531 11.8679 9.51074 12.0938 8.58789 12.0938H8.5C8.22386 12.0938 8 12.3177 8 12.5938V13.5Z" />
          <path d="M6.00195 13.5C6.00195 13.7761 5.7781 14 5.50195 14H4.77148C2.55664 14 1.81836 13.294 1.81836 11.1831V9.63691C1.81836 8.65221 1.52226 8.28984 0.499874 8.21308C0.224506 8.1924 0 7.97281 0 7.69667V6.31039C0 6.03425 0.224507 5.81466 0.499874 5.79398C1.52226 5.71722 1.81836 5.35485 1.81836 4.37015V2.81694C1.81836 0.706001 2.55664 0 4.77148 0H5.50195C5.7781 0 6.00195 0.223858 6.00195 0.5V1.4062C6.00195 1.68235 5.7781 1.9062 5.50195 1.9062H5.41406C4.49121 1.9062 4.30664 2.13212 4.30664 3.25466V5.27383C4.30664 6.22693 3.66406 6.83409 2.5498 6.93293V7.07413C3.66406 7.17297 4.30664 7.78013 4.30664 8.73323V10.7453C4.30664 11.8679 4.49121 12.0938 5.41406 12.0938H5.50195C5.7781 12.0938 6.00195 12.3177 6.00195 12.5938V13.5Z" />
        </svg>

      </div>
      <div className="font-bold text-sm leading-6 ml-2 truncate">
        {props.TemplateData.name}
      </div>
      <div className={'ml-auto text-xs shrink-0 ' + (isSelected() ? 'text-[#DBDBDB]' : 'text-[#747474]')}>
        {EditedAt()}
      </div>
    </div>
  )
}