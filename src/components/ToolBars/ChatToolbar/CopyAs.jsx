import { signal } from "@preact/signals";
import { showToast } from "../../../store/ui-slice";
import { connect, useDispatch } from "react-redux";
import { Component, createRef } from "preact";

class CopyAs extends Component {
  constructor(props) {
    super(props);
    this.CopyAsRef = createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      defaultSaveAs: 'md',
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
          id: 'ftd',
          label: 'Formatted'
        }
      ],
    }
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    const defaultSaveAs = localStorage.getItem('ANT_defaultSaveAs');

    if (defaultSaveAs) {
      this.setState({ defaultSaveAs: defaultSaveAs })
    }
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
    const defaultSaveAs = localStorage.getItem('ANT_defaultSaveAs');
    switch (defaultSaveAs) {
      case 'md':
        this.copyMarkdown();
        break;
      case 'txt':
        this.copyPlainText();
        break;
      case 'ftd':
        this.copyFormatted();
        break;
      default:
        this.copyMarkdown();
        break;
    }
  }

  copyMarkdown = () => {
    navigator.clipboard.writeText(this.props.msg.content);
    localStorage.setItem('ANT_defaultSaveAs', 'md');
    this.setState({ defaultSaveAs: 'md' })


    this.props.dispatch(showToast({ content: `Copied as markdown` }));
    this.props.toggleShowCopyAs(false);
  }

  copyPlainText = () => {
    let response = document.querySelector(`.response-${this.props.msg.uuid}`);

    let content = response.textContent;
    navigator.clipboard.writeText(content);
    localStorage.setItem('ANT_defaultSaveAs', 'txt');
    this.setState({ defaultSaveAs: 'txt' })



    this.props.dispatch(showToast({ content: `Copied as Plain Text` }));
    this.props.toggleShowCopyAs(false);
  }

  copyFormatted = () => {
    let response = document.querySelector(`.response-${this.props.msg.uuid}`);

    let content = response.innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const clipboardItem = new window.ClipboardItem({ 'text/html': blob });
    navigator.clipboard.write([clipboardItem]);
    localStorage.setItem('ANT_defaultSaveAs', 'ftd');
    this.setState({ defaultSaveAs: 'ftd' })

    this.props.dispatch(showToast({ content: `Copied as Formatted` }));
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
      case 'ftd':
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
          <div title={'Copy'} onClick={this.handleCopyDefault} className={"p-1.5 text-sm hover:bg-[#F2F2F2] " + (this.props.showCopyAs.value ? 'bg-[#F2F2F2]' : '')}>
            Copy <span class={'uppercase'}>{this.state.defaultSaveAs}</span>
          </div>
          <div onClick={this.toggleShowCopyAs} className={'border-l hover:bg-[#F2F2F2]'}>
            <div className={'px-1 py-2'}>
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
              <div style={option.id === this.state.defaultSaveAs ? { boxShadow: '4px 0px 0px 0px #DBDBDB inset' } : {}} onClick={() => this.handleCopy(option.id)} className="text-sm border-b py-2 px-[12px] text-[#202020] hover:bg-[#FAFAFA] cursor-pointer">
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </div >
    )
  }
}

export default connect(null)(CopyAs);