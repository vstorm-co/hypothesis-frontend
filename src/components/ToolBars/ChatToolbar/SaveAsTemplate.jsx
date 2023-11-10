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
        <div onClick={this.toggleShowSaveAs} className={"p-1 border border-[#DBDBDB] rounded-r cursor-pointer"}>
          <div className={"p-1 hover:bg-[#F2F2F2] " + (this.props.showSaveAs ? 'bg-[#F2F2F2]' : '')}>
            <img className="w-4" src={braces} alt="edit" />
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