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
        <div onClick={this.toggleAccountOptions} className={"cursor-pointer p-1 hover:bg-[#595959] relative rounded " + (this.state.showOptions ? "bg-[#595959]" : '')}>
          <img src={dots} alt="options" />
        </div>
        <div className={"absolute border border-[#595959] rounded min-w-[160px] bottom-[2rem] -left-[8rem] bg-[#0F0F0F] " + (this.state.showOptions ? '' : 'hidden')}>
          <div className="text-sm leading-6">
            <div onClick={this.setUser} className={"cursor-pointer flex p-2 hover:bg-[#595959]"}>
              <img className="w-4" src={check} alt="" /> <div className="ml-2">Select Account</div>
            </div>
            {!!!this.props.user.organization_uuid &&
              <div onClick={this.logOut} className={"cursor-pointer border-t border-[#595959] flex p-2 hover:bg-[#595959]"}>
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