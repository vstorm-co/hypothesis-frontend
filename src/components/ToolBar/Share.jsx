import share from '../../assets/share.svg';

export function Share() {
  return (
    <div className="relative">
      <div className="p-3 border-x border-[#DBDBDB]">
        <img className="w-4" src={share} alt="edit" />
      </div>
    </div>
  )
}