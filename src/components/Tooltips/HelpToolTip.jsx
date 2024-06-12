import Help from '../../assets/help.svg';
export function HelpToolTip(props) {
  return (
    <div className={'w-4 h-4 bg-[#EBEBEB] flex items-center justify-center ml-1 rounded-full cursor-help tooltip'}>
      <img src={Help} alt="" />
      <span className={'tooltiptext whitespace-nowrap'}>
        {props.content}
      </span>
    </div>
  )
}