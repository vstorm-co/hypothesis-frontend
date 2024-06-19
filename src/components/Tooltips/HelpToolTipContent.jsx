import { useSelector } from "react-redux"

export function HelpToolTipContent(props) {
  const position = useSelector(state => state.ui.helpToolTipPosition)
  const content = useSelector(state => state.ui.ToolTipContent);

  return (
    <div style={{ ...position }} className={'freetooltip'}>
      {content}
    </div>
  )
}