import logoutIcon from '../../../assets/logout.svg';
import { connect, useDispatch, useSelector } from 'react-redux';
import { route } from 'preact-router';
import { Component, createRef } from 'preact';

import { getUserOrganizationsData, userActions } from '../../../store/user-slice';
import { chatsActions } from '../../../store/chats-slice';

import dots from '../../../assets/dots.svg';
import check from '../../../assets/check.svg';
import { fetchModels } from '../../../store/ui-slice';

class AccountOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOptions: false,
    }
    this.AccountOptionsRef = createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (this.AccountOptionsRef && !this.AccountOptionsRef.current.contains(e.target)) {
      this.setState({ showOptions: false })
    }
  }

  toggleAccountOptions = () => {
    this.setState({ showOptions: !this.state.showOptions })
  }

  setUser = (e) => {
    const { dispatch } = this.props
    this.toggleAccountOptions();
    this.props.tglSwitch();
    dispatch(userActions.setUser(this.props.user));
    dispatch(chatsActions.setCurrentChat({}))
    dispatch(getUserOrganizationsData());
    dispatch(fetchModels());
    route('/');
  }

  logOut = () => {
    this.props.dispatch(userActions.logoutUser(this.props.user));
    this.props.tglSwitch();
  }

  render() {
    return (
      <div ref={this.AccountOptionsRef} className="ml-auto relative">
        <div onClick={(e) => { this.toggleAccountOptions(); e.stopPropagation(); }} className={"cursor-pointer transform rotate-90 p-1 hover:bg-[#595959] relative rounded " + (this.state.showOptions ? "bg-[#595959]" : '')}>
          <svg width="16" height="16" viewBox="0 0 16 16" className={this.props.colorClass} xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M2 6C3.10457 6 4 6.89543 4 8C4 9.10457 3.10457 10 2 10C0.89543 10 0 9.10457 0 8C0 6.89543 0.89543 6 2 6ZM8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6ZM16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10C15.1046 10 16 9.10457 16 8Z" />
          </svg>
        </div>
        <div className={"absolute max-w-[240px] border border-[#595959] rounded w-[240px] top-0 left-12 bg-[#0F0F0F] " + (this.state.showOptions ? '' : 'hidden')}>
          <div className="text-sm leading-6">
            <div onClick={this.setUser} className={"cursor-pointer border-b border-[#595959] flex py-3 px-4 hover:bg-[#595959]"}>
              <img className="w-4" src={check} alt="" /> <div className="ml-2">Select Account</div>
            </div>
            {!!!this.props.user.organization_uuid &&
              <div onClick={this.logOut} className={"cursor-pointer border-[#595959] flex py-3 px-4 hover:bg-[#595959]"}>
                <img className="w-4" src={logoutIcon} alt="" /> <div className="ml-2">Logout</div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null)(AccountOptions)