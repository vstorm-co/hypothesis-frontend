import logoutIcon from '../../../assets/logout.svg';
import { connect, useDispatch, useSelector } from 'react-redux';
import { route } from 'preact-router';
import { Component, createRef } from 'preact';

import { userActions } from '../../../store/user-slice';
import { chatsActions } from '../../../store/chats-slice';

import dots from '../../../assets/dots.svg';
import check from '../../../assets/check.svg';

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
            <div className={"cursor-pointer border-b border-[#595959] flex items-center w-full py-3 px-4 hover:bg-[#595959]"}>
              <div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C13.6569 0 15 1.34315 15 3C15 4.65685 13.6569 6 12 6C10.3431 6 9 4.65685 9 3C9 1.34315 10.3431 0 12 0ZM4 4C5.65685 4 7 5.34315 7 7C7 8.65685 5.65685 10 4 10C2.34315 10 1 8.65685 1 7C1 5.34315 2.34315 4 4 4ZM16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 11.5523 8.44771 12 9 12C9.55229 12 10 11.5523 10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11L14.0067 11.1166C14.0645 11.614 14.4872 12 15 12C15.5523 12 16 11.5523 16 11ZM8 15C8 12.7909 6.20914 11 4 11C1.79086 11 0 12.7909 0 15C0 15.5523 0.447715 16 1 16C1.55228 16 2 15.5523 2 15C2 13.8954 2.89543 13 4 13C5.10457 13 6 13.8954 6 15L6.00673 15.1166C6.06449 15.614 6.48716 16 7 16C7.55228 16 8 15.5523 8 15ZM3 7C3 6.44772 3.44772 6 4 6C4.55228 6 5 6.44772 5 7C5 7.55228 4.55228 8 4 8C3.44772 8 3 7.55228 3 7ZM11 3C11 2.44772 11.4477 2 12 2C12.5523 2 13 2.44772 13 3C13 3.55228 12.5523 4 12 4C11.4477 4 11 3.55228 11 3Z" fill="#747474" />
                </svg>
              </div>

              <div className="ml-2">Organization settings</div>
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