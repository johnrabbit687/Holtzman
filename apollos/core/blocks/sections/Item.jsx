import { Component, PropTypes} from "react"
import { Link } from "react-router"

import { VelocityTransitionGroup } from "velocity-react"

import { ImageLoader } from "../../components/loading"
import LoadingStyles from "../../components/loading/FeedItemSkeleton.css"


const ExternalLinkWrapper = (props) => {

  let url = props.to
  if (props.to.match("//") === null) {
    return (
      <Link {...props} to={url} >
        {props.children}
      </Link>
    )
  }

  if (url[0] != "/") {
    url = "/" + url
  }
  return (
    <a
      {...props}
      href={url}
    >
      {props.children}
    </a>
  )

}

// context from ImageLoader
function preloader() {
  return (
    <div
      id={this.id}
      className={`${this.imageclasses.join(" ")} ${LoadingStyles["load-item"]}`}
      >
      {this.children}
    </div>
  );
}

// context from ImageLoader
function renderElement() {
  return (
    <div
      id={this.id}
      className={this.imageclasses.join(" ")}
      style={this.style}
      >
      {this.children}
    </div>
  );
}

const ChildItem = ({ section, go }) => {
  if (!section) {
    return (
      <div className="one-whole grid__item">
        <div className="rounded ratio--landscape">
          <div className="ratio__item"></div>
        </div>
      </div>
    )
  }

  const imageclasses = [
    "overlay--solid-medium",
    "background--fill",
    "background--dark-tertiary",
    "rounded",
    "ratio--thin",
    "floating--bottom",
    "floating--left"
  ];

  return (
    <div className="one-whole soft-half-left grid__item push-half-bottom">
      <ExternalLinkWrapper
        to={section.link}
        className="plain"
        onClick={go}
        id={section.id}
      >
        <ImageLoader
          src={section.image}
          preloader={preloader}
          renderElement={renderElement}
          force={true}
          imageclasses={imageclasses}
          style={{backgroundImage: `url(${section.image})`}}
          >
          <div className="overlay__item floating__item ratio__item">
            <h6 className="text-light-primary soft-left">{section.text}</h6>
          </div>
        </ImageLoader>
      </ExternalLinkWrapper>
    </div>
  )
}


const Item = ({ section, go, children }) => {
  if (!section) {
    return (
      <div className="one-half grid__item">
        <div className="rounded ratio--square">
          <div className="ratio__item"></div>
        </div>
      </div>
    )
  }

  const imageclasses = [
    "overlay--gradient",
    "background--fill",
    "background--dark-tertiary",
    "rounded",
    "ratio--square",
    "floating--bottom",
    "floating--left"
  ];

  return (
    <div className="one-half soft-half-left grid__item push-half-bottom">
      <ExternalLinkWrapper
        to={section.link}
        className="plain"
        onClick={go}
        force={true}
        id={section.id}
      >
        <ImageLoader
          src={section.image}
          preloader={preloader}
          renderElement={renderElement}

          imageclasses={imageclasses}
          style={{backgroundImage: `url(${section.image})`}}
          >
          <div className="overlay__item floating__item ratio__item">
            <h6 className="text-light-primary soft-left">{section.text}</h6>
          </div>
        </ImageLoader>
      </ExternalLinkWrapper>
      {children}
    </div>
  )
}

export default class SectionItem extends Component {

  static propTypes = {
    sections: PropTypes.array,
    hide: PropTypes.func.isRequired
  }

  state = {
    section: null
  }

  expandOrGo = (e) => {
    const { id } = e.currentTarget

    for (let section of this.props.sections) {
      if (Number(section.id) === Number(id) && section.children.length) {
        e.preventDefault()

        // if a section is open and a different section is clicked
        // then change the opened section to the one clicked
        if (this.state.section != null && Number(this.state.section.id) !== Number(id)) {
          this.setState({ section: null });
          setTimeout(() => {
            this.setState({ section: section });
          },400);
        }

        // if a section is open and that section is clicked
        // then close the section clicked
        else if (this.state.section != null && Number(section.id) === Number(id)) {
          this.setState({ section: null })
        }

        // else nothing is open
        // and open the section clicked
        else {
          this.setState({ section: section })
        }

        return

      }
    }

    this.props.hide()

  }

  renderChildren = () => {
    const { section } = this.state

    if (!section) {
      return null
    }

    let children = []

    for (let child in section.children) {
      children.push(section.children[child])
    }

    return (
      <div className="soft-half-right soft-left soft-top background--dark-primary push-bottom">
        {/* <h4 className="soft-half-bottom text-light-primary text-center">{section.text}</h4>*/}
        <div className="grid ">

          {children.map((sectionItem, i) => (
            <ChildItem section={sectionItem} key={i} go={this.expandOrGo} />
          ))}

        </div>
      </div>

    )

  }

  renderArrow = (sectionItem) => {
    const { section } = this.state

    if (!section) {
      return null
    }

    if (section.id != sectionItem.id) {
      return null
    }

    return (
      <div className="locked background--dark-primary" style={{
        height: 0,
        width: 0,
        background: "transparent",
        borderWidth: "0 15px 10px 15px",
        borderColor: "transparent transparent #303030 transparent",
        borderStyle: "solid",
        marginBottom: "-10px",
        left: "50%",
        marginLeft: "-10px",
        marginTop:"2px"
        }}>
      </div>
    )
  }

  render () {

    const { sections } = this.props

    return (
      <div>
        <div className="soft-half-right soft-left">
          <div className="grid">
            <div className="grid__item one-whole" >
              <div className="grid">
                {sections.map((sectionItem, i) => (
                  <Item section={sectionItem} key={i} go={this.expandOrGo}>
                    {this.renderArrow(sectionItem)}
                  </Item>
                ))}
              </div>

            </div>
          </div>
        </div>

        <div className="one-whole">
          <VelocityTransitionGroup
            enter={{
              animation: "slideDown", duration: 250
            }}
            leave={{
              animation: "slideUp", duration: 250
            }}
          >
            {this.renderChildren()}
          </VelocityTransitionGroup>
        </div>
      </div>
    )


  }
}