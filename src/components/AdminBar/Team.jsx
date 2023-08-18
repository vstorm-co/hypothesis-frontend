import { User } from './User';

export function Team(props) {
  return (
    <div>
      <div className="flex items-center pt-3">
        <div className="text-sm leading-6">
          {props.name}
        </div>
      </div>
      <div className={'ml-1'}>
        <User name={'Jared Pendergraft'} />
        <User name={'Mathew Sigmunt'} />
        <User name={'Jacob Engeyak'} />
      </div>
    </div>
  )
}