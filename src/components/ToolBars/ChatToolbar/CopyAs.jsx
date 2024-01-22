import { signal } from "@preact/signals";
import { showToast, uiActions } from "../../../store/ui-slice";
import { connect, useDispatch } from "react-redux";
import { Component, createRef } from "preact";

class CopyAs extends Component {
  constructor(props) {
    super(props);
    this.CopyAsRef = createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.state = {
      options: [
        {
          id: 'md',
          label: 'Markdown'
        },
        {
          id: 'txt',
          label: 'Plain Text',
        },
        {
          id: 'rtf',
          label: 'Rich Text'
        }
      ],
    }
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (this.CopyAsRef && !this.CopyAsRef.current.contains(e.target)) {
      this.props.toggleShowCopyAs(false);
    }
  }

  toggleShowCopyAs = () => {
    // this.setState({ showCopyAs: !this.state.showCopyAs })
    this.props.toggleShowCopyAs(!this.props.showCopyAs);
  }

  handleCopyDefault = () => {
    switch (this.props.copyAs) {
      case 'md':
        this.copyMarkdown();
        break;
      case 'txt':
        this.copyPlainText();
        break;
      case 'rtf':
        this.copyFormatted();
        break;
      default:
        this.copyMarkdown();
        break;
    }
  }

  copyMarkdown = () => {
    navigator.clipboard.writeText(this.props.msg.content);

    this.props.dispatch(showToast({ content: `Copied as markdown` }));
    this.props.dispatch(uiActions.changeCopyAs('md'))
    this.props.toggleShowCopyAs(false);
  }

  copyPlainText = () => {
    let response = document.querySelector(`.response-${this.props.msg.uuid}`);
    let content = response.textContent;

    navigator.clipboard.writeText(content);

    this.props.dispatch(showToast({ content: `Copied as Plain Text` }));
    this.props.dispatch(uiActions.changeCopyAs('txt'))
    this.props.toggleShowCopyAs(false);
  }

  copyFormatted = () => {
    let response = document.querySelector(`.response-${this.props.msg.uuid}`);
    let content = response.innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const clipboardItem = new window.ClipboardItem({ 'text/html': blob });

    navigator.clipboard.write([clipboardItem]);

    this.props.dispatch(showToast({ content: `Copied as Formatted` }));
    this.props.dispatch(uiActions.changeCopyAs('rtf'))
    this.props.toggleShowCopyAs(false);
  }

  handleCopy = (id) => {
    switch (id) {
      case 'md':
        this.copyMarkdown();
        break;
      case 'txt':
        this.copyPlainText();
        break;
      case 'rtf':
        this.copyFormatted();
        break;
      default:
        this.copyMarkdown();
        break;
    }
  }
  render() {
    return (
      <div ref={this.CopyAsRef} className={'relative'}>
        <div className={"border border-[#DBDBDB] rounded cursor-pointer flex items-center"}>
          <div title={`Copy ${this.state.options.find(o => o.id === this.props.copyAs).label}`} onClick={this.handleCopyDefault} className={"p-1 text-sm hover:bg-[#F2F2F2] " + (this.props.showCopyAs.value ? 'bg-[#F2F2F2]' : '')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M19 4C19.5128 4 19.9355 4.38604 19.9933 4.88338L20 5V15C20 15.5128 19.614 15.9355 19.1166 15.9933L19 16H11C10.4872 16 10.0645 15.614 10.0067 15.1166L10 15V5C10 4.48716 10.386 4.06449 10.8834 4.00673L11 4H19ZM8 8C8.55228 8 9 8.44772 9 9C9 9.51284 8.61396 9.93551 8.11662 9.99327L8 10H6V18H13C13.5128 18 13.9355 18.386 13.9933 18.8834L14 19C14 19.5128 13.614 19.9355 13.1166 19.9933L13 20H5C4.48716 20 4.06449 19.614 4.00673 19.1166L4 19V9C4 8.48716 4.38604 8.06449 4.88338 8.00673L5 8H8ZM12 6H18V14H12V6Z" fill="#747474" />
            </svg>
          </div>
          <div onClick={this.toggleShowCopyAs} className={'border-l hover:bg-[#F2F2F2]'}>
            <div className={'px-2 py-2 flex gap-2 text-[#747474]'}>
              <span className={'uppercase font-bold text-xs'}>{this.props.copyAs}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.29289 5.29289C3.65338 4.93241 4.22061 4.90468 4.6129 5.2097L4.70711 5.29289L8 8.585L11.2929 5.29289C11.6534 4.93241 12.2206 4.90468 12.6129 5.2097L12.7071 5.29289C13.0676 5.65338 13.0953 6.22061 12.7903 6.6129L12.7071 6.70711L8.70711 10.7071C8.34662 11.0676 7.77939 11.0953 7.3871 10.7903L7.29289 10.7071L3.29289 6.70711C2.90237 6.31658 2.90237 5.68342 3.29289 5.29289Z" fill="#747474" />
              </svg>
            </div>
          </div>
        </div>
        <div className={"absolute z-50 border rounded w-[160px] right-0 top-10 bg-white " + (this.props.showCopyAs ? '' : 'hidden')}>
          <div className="">
            <div className="text-[12px] border-b py-2 px-[12px] font-bold text-[#747474]">
              Copy As
            </div>
            {this.state.options.map(option => (
              <div style={option.id === this.props.copyAs ? { boxShadow: '4px 0px 0px 0px #DBDBDB inset' } : {}} onClick={() => this.handleCopy(option.id)} className="text-sm flex justify-between items-center border-b py-2 px-[12px] text-[#202020] hover:bg-[#FAFAFA] cursor-pointer">
                {option.label}
                <span className={'uppercase font-bold text-xs text-[#747474]'}>{option.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    copyAs: state.ui.copyAs
  }
}

export default connect(mapStateToProps)(CopyAs);