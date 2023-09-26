import braces from '../../assets/braces.svg'

export function TemplateBar(props) {
  return (
    <div className={"flex items-center py-2 px-2 rounded cursor-pointer " + (false ? 'bg-[#595959]' : 'hover:bg-[#0F0F0F]')}>
      <img className="w-4" src={braces} alt="" />
      <div className="font-base text-sm leading-6 ml-2">
        {props.TemplateData.name}
      </div>
    </div>
  )
}