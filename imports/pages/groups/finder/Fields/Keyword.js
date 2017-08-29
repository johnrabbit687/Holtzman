import { Component, PropTypes } from "react";
import Forms from "../../../../components/@primitives/UI/forms";
import Tag from "../../../../components/@primitives/UI/tags";
import Svg from "../../../../components/@primitives/UI/svg";

const focusedInput = {
  border: "1px solid #f0f0f0",
  borderRadius: 7,
  boxShadow: "0px 2px 9px #DDD",
  backgroundColor: "#FFFFFF",
  textTransform: "captialize",
  position: "relative",
  zIndex: 99,
};

const hiddenInput = {
  border: 0,
};

export default class Keywords extends Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    selectedTags: PropTypes.array.isRequired,
    searchQuery: PropTypes.array.isRequired,
    tagOnClick: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state: {
    focused: boolean,
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      focused: false,
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    document.addEventListener("touchstart", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    document.removeEventListener("touchend", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  // /**
  //  * Alert if clicked on outside of element
  //  */
  handleClickOutside(e: Event) {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.setState({
        focused: false,
      });
    }
  }

  setFocus = (e: Event) => {
    if (e) e.preventDefault();

    this.setState({
      focused: !this.state.focused,
    });
  };

  onBlur = (e: Event) => {
    if (e.type === "keydown" && e.keyCode === 9) {
      if (!Meteor.isCordova) {
        this.setFocus();
      }
    }
  };

  render() {
    const {
      tags,
      tagOnClick,
      selectedTags,
      searchQuery,
      onChange,
    } = this.props;

    const loweredTags = selectedTags.map(t => t.toLowerCase());

    return (
      <div
        style={this.state.focused ? focusedInput : hiddenInput}
        className={"soft-double-top text-left soft-half-sides"}
        ref={this.setWrapperRef}
        onKeyDown={this.onBlur}
        onFocus={this.setFocus}
      >
        <Forms.Input
          classes={this.state.focused ? "soft-bottom" : ""}
          inputClasses={
            "outlined--dotted outlined--light h6 capitalize flush-bottom text-black"
          }
          type="text"
          label={"I'm looking for..."}
          name="keywords"
          defaultValue={searchQuery}
          onChange={onChange}
          ignoreLastPass
        >
          <button
            id="keywordButton"
            style={{
              position: "absolute",
              right: "0",
              backgroundColor: "#FFFFFF",
              top: "-1px",
              paddingLeft: "5px",
            }}
            onClick={this.setFocus}
          >
            <Svg
              name={this.state.focused ? "arrowUp" : "arrowDown"}
              fill={this.state.focused ? "#6BAC43" : "#505050"}
              width={"24px"}
              height={"24px"}
              title={this.state.focused ? "Arrow Up Icon" : "Arrow Down Icon"}
            />
          </button>
        </Forms.Input>
        <div
          className={`push-half-sides push-half-bottom ${!this.state.focused
            ? "visuallyhidden"
            : ""}`}
        >
          {/* weird SSR stuff here to investigate */}
          {tags.map((tag, i) =>
            <Tag
              className=""
              style={{ textTransform: "capitalize" }}
              onClick={tagOnClick}
              key={i}
              val={tag.value}
              active={loweredTags.indexOf(tag.value) + 1}
            />,
          )}
        </div>
      </div>
    );
  }
}
