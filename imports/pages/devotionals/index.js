import { Component, PropTypes } from "react";
import ReactMixin from "react-mixin";
import { connect } from "react-redux";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { FeedItemSkeleton } from "../../components/loading";
import ApollosPullToRefresh from "../../components/pullToRefresh";
import FeedItem from "../../components/cards/cards.FeedItem";

import Headerable from "../../mixins/mixins.Header";
import Pageable from "../../mixins/mixins.Pageable";

import { nav as navActions } from "../../store";

import Single from "./devotions.Single";

const DEVOTIONALS_QUERY = gql`
  query getDevotionals($limit: Int!, $skip: Int!) {
    content(channel: "devotionals", limit: $limit, skip: $skip) {
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
        body
        images(sizes: ["large"]) {
          fileName
          fileType
          fileLabel
          url
        }
      }
    }
  }
`;

const withDevotionals = graphql(DEVOTIONALS_QUERY, {
  options: state => ({
    variables: {
      limit: state.paging.pageSize * state.paging.page,
      skip: state.paging.skip,
    },
  }),
});

const mapStateToProps = state => ({ paging: state.paging });

@connect(mapStateToProps)
@withDevotionals
@ReactMixin.decorate(Pageable)
@ReactMixin.decorate(Headerable)
class Devotions extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.dispatch(navActions.setLevel("TOP"));
    this.headerAction({ title: "All Devotionals" });
  }

  handleRefresh = (resolve, reject) => {
    this.props.data.refetch()
      .then(resolve)
      .catch(reject);
  }

  renderItems = () => {
    const { content } = this.props.data;
    let items = [1, 2, 3, 4, 5];
    if (content) items = content;
    return (
      items.map((item, i) => (
        <div
          className={
            "grid__item one-half@palm-wide one-third@portable one-quarter@anchored " +
            "flush-bottom@handheld push-bottom@portable push-bottom@anchored"
          }
          key={i}
        >
          {(() => {
            if (typeof item === "number") return <FeedItemSkeleton />;
            return <FeedItem item={item} />;
          })()}
        </div>
      ))
    );
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
  { path: "devotions", component: Devotions },
  { path: "devotions/:id", component: Single },
];

export default {
  Devotions,
  Routes,
};
