import React, { PropTypes } from "react"
import NavLink from "./nav.link"
import styles from "./nav.css";

export default class NavLayout extends React.Component {


  layoutClasses = () => {
    let classes = [
      // "background--dark-primary",
      "one-whole",
      "floating",
      "soft-half",
      "locked-left",
      "locked-bottom",
      "hard-sides@lap-and-up",
      "soft-half-top@lap-and-up"
    ];


    if (this.props.classes) {
      classes.concat(this.props.classes);
    } else {
      classes.push(styles["nav-bar"]);
    }

    return classes.join(" ");
  }

  isLiked = () => {
    const urlParts = window.location.pathname.split("/");
    const entryId = urlParts[urlParts.length-1];
    return _.contains(this.props.liked.likes, String(entryId))
  }

  render () {

    const { handleAction, back, reset } = this.props
    return (
      <section className={ this.props.theme || this.layoutClasses() } style={{backgroundColor: "#202020"}}>
        {this.props.links.map((item, i) => {
          return (
            <NavLink
              navItem={item}
              key={i}
              handleAction={handleAction}
              reset={reset}
              modal={this.props.modal}
              liked={this.isLiked()}
            />
          );
        })}
      </section>
    )
  }
}
