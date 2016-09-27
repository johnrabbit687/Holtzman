import { Component, PropTypes } from "react";
import ReactMixin from "react-mixin";
import { connect } from "react-redux";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import ApollosPullToRefresh from "../../components/pullToRefresh";
import { FeedItemSkeleton } from "../../components/loading";
import FeedItem from "../../components/cards/cards.FeedItem";

import Headerable from "../../mixins/mixins.Header";
import Pageable from "../../mixins/mixins.Pageable";

import { nav as navActions } from "../../store";

import Album from "./music.Album";

const ALBUMS_QUERY = gql`
  query getAlbums($limit: Int!, $skip: Int!) {
    content(channel: "newspring_albums", limit: $limit, skip: $skip) {
      id
      entryId: id
      title
      status
      channelName
      meta {
        urlTitle
        siteId
        date
        channelId
      }
      content {
        images(sizes: ["large"]) {
          fileName
          fileType
          fileLabel
          url
        }
        tracks {
          file: s3
        }
      }
    }
  }
`;

const withAlbums = graphql(ALBUMS_QUERY, {
  options: state => ({
    variables: {
      limit: state.paging.pageSize * state.paging.page,
      skip: state.paging.skip,
    },
  }),
});

const mapStateToProps = state => ({ paging: state.paging });

@withAlbums
@connect(mapStateToProps)
@ReactMixin.decorate(Pageable)
@ReactMixin.decorate(Headerable)
class Template extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.dispatch(navActions.setLevel("TOP"));
    this.headerAction({ title: "All Music" });
  }

  handleRefresh = (resolve, reject) => {
    this.props.data.refetch()
      .then(resolve)
      .catch(reject);
  }

  renderItems = () => {
    const { content } = this.props.data;
    let loading = true;
    let items = [1, 2, 3, 4, 5];

    if (content) {
      loading = false;
      items = _.filter(content, item => (
        _.any(item.content.tracks, track => !!track.file)
      ));
    }

    return items.map((item, i) => (
      <div
        className={
          "grid__item one-half@palm-wide one-third@portable one-quarter@anchored " +
          "flush-bottom@handheld push-bottom@portable push-bottom@anchored"
        }
        key={i}
      >
        {(() => {
          if (loading) return <FeedItemSkeleton />;
          return <FeedItem item={item} />;
        })()}
      </div>
    ));
  }


  render() {
    return (
      <ApollosPullToRefresh handleRefresh={this.handleRefresh}>
        <div className="background--light-secondary">
          <section className="soft-half">
            <div className="grid">
              {this.renderItems()}
            </div>
          </section>
        </div>
      </ApollosPullToRefresh>
    );
  }
}


const Routes = [
  { path: "music", component: Template },
  { path: "music/:id", component: Album },
];

export default {
  Template,
  Routes,
};
