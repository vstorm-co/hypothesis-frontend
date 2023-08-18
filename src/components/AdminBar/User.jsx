export function User(props) {
  return (
    <div className="flex items-center py-3">
      <div className="w-6 h-6 bg-white rounded-full mr-2"></div>
      <div className="text-sm leading-6">
        {props.name}
      </div>
    </div>
  )
}