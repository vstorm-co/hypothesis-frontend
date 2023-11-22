import { signal } from '@preact/signals';
import { createTemplate } from '../../../store/templates-slice';

import braces from '../../../assets/braces.svg';
import { Component, createRef } from 'preact';
import { connect } from 'react-redux';

class SaveAsTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateTitle: "",
    }
    this.SaveAsTemplateRef = createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (this.SaveAsTemplateRef && !this.SaveAsTemplateRef.current.contains(e.target)) {
      this.props.toggleShowSaveAs(false);
    }
  }

  toggleShowSaveAs = () => {
    this.props.toggleShowSaveAs(!this.props.showSaveAs);
  }

  callCreateTemplate = (e) => {
    if (e.target.value.length > 1) {
      this.props.dispatch(createTemplate({ name: e.target.value, content: this.props.msg.content, content_html: this.props.msg.content_html }));
    }
    this.props.toggleShowSaveAs(!this.props.showSaveAs);
  }


  render() {
    return (
      <div ref={this.SaveAsTemplateRef} className={'relative mt-2'}>
        <div title={'Save as Template'} onClick={this.toggleShowSaveAs} className={"border border-[#DBDBDB] rounded rounded-r-none border-r-0 cursor-pointer"}>
          <div className={"p-1 hover:bg-[#F2F2F2] " + (this.props.showSaveAs ? 'bg-[#F2F2F2]' : '')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 18.5C13 18.7761 13.2239 19 13.5 19H14.2305C16.4453 19 17.1836 18.294 17.1836 16.1831V14.6369C17.1836 13.6522 17.4797 13.2898 18.5021 13.2131C18.7774 13.1924 19.002 12.9728 19.002 12.6967V11.3104C19.002 11.0342 18.7774 10.8147 18.5021 10.794C17.4797 10.7172 17.1836 10.3549 17.1836 9.37015V7.81694C17.1836 5.706 16.4453 5 14.2305 5H13.5C13.2239 5 13 5.22386 13 5.5V6.4062C13 6.68235 13.2239 6.9062 13.5 6.9062H13.5879C14.5107 6.9062 14.6953 7.13212 14.6953 8.25466V10.2738C14.6953 11.2269 15.3379 11.8341 16.4521 11.9329V12.0741C15.3379 12.173 14.6953 12.7801 14.6953 13.7332V15.7453C14.6953 16.8679 14.5107 17.0938 13.5879 17.0938H13.5C13.2239 17.0938 13 17.3177 13 17.5938V18.5Z" fill="#747474" />
              <path d="M11.002 18.5C11.002 18.7761 10.7781 19 10.502 19H9.77148C7.55664 19 6.81836 18.294 6.81836 16.1831V14.6369C6.81836 13.6522 6.52226 13.2898 5.49987 13.2131C5.22451 13.1924 5 12.9728 5 12.6967V11.3104C5 11.0342 5.22451 10.8147 5.49987 10.794C6.52226 10.7172 6.81836 10.3549 6.81836 9.37015V7.81694C6.81836 5.706 7.55664 5 9.77148 5H10.502C10.7781 5 11.002 5.22386 11.002 5.5V6.4062C11.002 6.68235 10.7781 6.9062 10.502 6.9062H10.4141C9.49121 6.9062 9.30664 7.13212 9.30664 8.25466V10.2738C9.30664 11.2269 8.66406 11.8341 7.5498 11.9329V12.0741C8.66406 12.173 9.30664 12.7801 9.30664 13.7332V15.7453C9.30664 16.8679 9.49121 17.0938 10.4141 17.0938H10.502C10.7781 17.0938 11.002 17.3177 11.002 17.5938V18.5Z" fill="#747474" />
            </svg>
          </div>
        </div>
        <div className={"absolute z-50 border rounded right-0 top-10 bg-white " + (this.props.showSaveAs ? '' : 'hidden')}>
          <div className="border-b p-2">
            <div className="text-xs font-bold text-[#747474] mb-1">
              Title
            </div>
            <input onChangeCapture={(event) => this.callCreateTemplate(event)} type="text" className="bg-[#F2F2F2] border border-[#DBDBDB] rounded focus:outline-none p-2" />
            <div className={'text-[10px] mt-0.5 text-right text-[#747474]'}>
              press 'Enter' to confirm
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null)(SaveAsTemplate)