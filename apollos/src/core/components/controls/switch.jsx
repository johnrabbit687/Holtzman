import { Component, PropTypes } from "react";
import { css } from "aphrodite";

import Styles from "./switch-css"

export default class Switch extends Component {

  static propTypes = {
    id: PropTypes.number.isRequired,
    changed: PropTypes.func.isRequired
  }

  layoutClasses = () => {
    let classes = [
      css(Styles["toggle-switch"])
    ];

    if (this.props.classes) {
      classes = classes.concat(this.props.classes);
    }

    return classes.join(" ");
  }

  changed = () => {
    this.props.changed(this.props.id);
  }

  render() {

    const switchId = `switch-${this.props.id}`;

    return (
      <div className={this.props.containerClasses} style={this.props.containerStyle}>
        <input
          className={ this.props.theme || this.layoutClasses()}
          styles={this.props.styles || {}}
          type="checkbox"
          name={this.props.name || switchId || "toggle-switch"}
          id={switchId}
          onChange={this.changed}
          checked={this.props.active}
        />
        <label htmlFor={switchId} className={`float-right ${css(Styles.label)} ${this.props.active ? css(Styles["checked-label"]) : ""}`}></label>
      </div>
    );

  }

}
