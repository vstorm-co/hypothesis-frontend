import { signal } from "@preact/signals";
import { showToast } from "../../../store/ui-slice";
import { connect, useDispatch } from "react-redux";
import { Component, createRef } from "preact";

class CopyAs extends Component {
  constructor(props) {
    super(props);
    this.CopyAsRef = createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
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

  copyMarkdown = () => {
    navigator.clipboard.writeText(this.props.msg.content);
    this.props.dispatch(showToast({ content: `Copied as markdown` }));
    this.props.toggleShowCopyAs(false);
  }

  copyPlainText = () => {
    let response = document.querySelector(`.response-${this.props.msg.uuid}`);

    let content = response.textContent;
    navigator.clipboard.writeText(content);

    this.props.dispatch(showToast({ content: `Copied as Plain Text` }));
    this.props.toggleShowCopyAs(false);
  }

  copyFormatted = () => {
    let response = document.querySelector(`.response-${this.props.msg.uuid}`);

    let content = response.innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const clipboardItem = new window.ClipboardItem({ 'text/html': blob });
    navigator.clipboard.write([clipboardItem]);

    this.props.dispatch(showToast({ content: `Copied as Formatted` }));
    this.props.toggleShowCopyAs(false);
  }
  render() {
    return (
      <div ref={this.CopyAsRef} className={'relative mt-2'}>
        <div onClick={this.toggleShowCopyAs} className={"p-1 border border-[#DBDBDB] rounded-r cursor-pointer"}>
          <div className={"p-1 hover:bg-[#F2F2F2] " + (this.props.showCopyAs.value ? 'bg-[#F2F2F2]' : '')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M15 0C15.5128 0 15.9355 0.38604 15.9933 0.883379L16 1V11C16 11.5128 15.614 11.9355 15.1166 11.9933L15 12H7C6.48716 12 6.06449 11.614 6.00673 11.1166L6 11V1C6 0.487164 6.38604 0.0644928 6.88338 0.00672773L7 0H15ZM4 4C4.55228 4 5 4.44772 5 5C5 5.51284 4.61396 5.93551 4.11662 5.99327L4 6H2V14H9C9.51284 14 9.93551 14.386 9.99327 14.8834L10 15C10 15.5128 9.61396 15.9355 9.11662 15.9933L9 16H1C0.487164 16 0.0644928 15.614 0.00672773 15.1166L0 15V5C0 4.48716 0.38604 4.06449 0.883379 4.00673L1 4H4ZM8 2H14V10H8V2Z" fill="#747474" />
            </svg>
          </div>
        </div>
        <div className={"absolute z-50 border rounded w-[160px] right-0 top-10 bg-white " + (this.props.showCopyAs ? '' : 'hidden')}>
          <div className="">
            <div className="text-[12px] border-b py-2 px-[12px] font-bold text-[#747474]">
              Copy As
            </div>
            <div onClick={this.copyMarkdown} className="text-sm border-b py-2 px-[12px] text-[#202020] hover:bg-[#FAFAFA] cursor-pointer">
              Markdown
            </div>
            <div onClick={this.copyPlainText} className="text-sm border-b py-2 px-[12px] text-[#202020] hover:bg-[#FAFAFA] cursor-pointer">
              Plain text
            </div>
            <div onClick={this.copyFormatted} className="text-sm border-b py-2 px-[12px] text-[#202020] hover:bg-[#FAFAFA] cursor-pointer">
              Formated
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null)(CopyAs);