import { Component } from "react"
import ReactMixin from "react-mixin"

import { Likes } from "../../../core/collections"
import { Loading } from "../../../core/components"

import LikesItem from "./Item"

@ReactMixin.decorate(ReactMeteorData)
export default class LikesContainer extends Component {

  getMeteorData() {
    Meteor.subscribe("likes")
    const likes = Likes.find().fetch()

    return {
      likes
    }
  }

  render() {

    if (!this.data.likes) {
      <Loading />
    }

    const likes = this.data.likes

    return(
      <div>
        {likes.map((like, i) => {
          return <LikesItem like={like} key={i} />
        })}
      </div>
    );

  }

}