import { Component, PropTypes} from "react"
import { Link } from "react-router"
import Meta from "react-helmet"

import Split, { Left, Right } from "../../../core/blocks/split"
import { Toggle } from "../../../core/components/controls"

const SettingsLink = () => (
  <Link to="/profile/settings" className="text-light-primary plain soft overlay__item locked-top locked-right">
    <i className="icon-settings h4"></i>
  </Link>
)

const Layout = ({ photo, person, onToggle, content, onUpload }) => (
  <Split nav={true}>

    <Meta
      title={`${person.nickName} ${person.lastName}`}
      titleTemplate="%s | NewSpring Church"
    />

    <Right
      mobile={true}
      classes={["floating", "overlay--solid-dark"]}
      ratioClasses={["floating__item", "overlay__item", "one-whole", "text-center"]}
      background={photo}
      blur={true}
      outsideRatio={SettingsLink}
    >
      <div className="soft one-whole">
        <label htmlFor="file"
          className="background--fill ratio--square round two-fifths display-inline-block"
          style={{ backgroundImage: `url(${photo})`, position: "relative"}}
        >
          <input onChange={onUpload} type="file" className="locked-ends locked-sides" style={{opacity: 0}} />
        </label>
      <h4 className="text-light-primary soft-half-top flush-bottom">{person.nickName} {person.lastName}</h4>
        <p className="text-light-primary flush"><em>{person.home.city}</em></p>
      </div>

    </Right>

    <Left scroll={true}>
      <Toggle items={["Likes", "Following"]} toggle={onToggle} />

      <div>

        {content}

      </div>
    </Left>

  </Split>
)


export default Layout