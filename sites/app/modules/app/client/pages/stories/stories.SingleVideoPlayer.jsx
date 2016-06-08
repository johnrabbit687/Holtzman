import { Component, PropTypes } from "react";

import { Video } from "app/client/components/players"
import Helpers from "app/client/helpers"


export default class StoriesSingleVideoPlayer extends Component {

  static propTypes = {
    story: PropTypes.object.isRequired
  }

  render() {

    const story = this.props.story;

    return (
      <div
        className="background--fill overlay--gradient ratio--landscape floating"
        style={Helpers.backgrounds.styles(story, { label: "2:1" })}>
        <i className="text-light-primary plain floating__item overlay__item icon-play h1"></i>
        <div style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "100%",
            zIndex: "10"
          }}>
          <Video
            id={story.content.ooyalaId}
            ref="video"
            hide={false}
          />
        </div>


      </div>
    );

  }

}