import { Component, PropTypes} from "react"
import { connect } from "react-redux"

import { GraphQL } from "../../graphql"
import Nav from "../nav"
import Modal from "../modal"
import { People, Likes } from "../../collections"

import {
  onBoard as onBoardActions,
  liked as likedActions,
  topics as topicActions
} from "../../store"


const App = ({ children, className }) => (
  <div className="
    push-double-bottom@handheld soft-bottom@handheld
    push-double-left@lap-and-up soft-double-left@lap-and-up
    "
  >
    <div className={className}>
      {children}
      <Nav />
      <Modal/>
    </div>

  </div>
)



function getUser(id, dispatch) {

  // this is probably to heavy of a universal call?
  let personQuery = `
    {
      person(mongoId: "${id}") {
        age
        birthdate
        campus {
          name
          shortCode
        }
        home {
          city
          country
          id
          zip
          state
          street1
          street2
        }
        firstName
        lastName
        nickName
        email
        phoneNumbers {
          number
          formated
        }
        photo
      }
    }
  `

  return GraphQL.query(personQuery)
    .then(({ person }) => {
      dispatch(onBoardActions.person(person))
    })

}

function bindLogout(dispatch) {
  let handle = {}

  Tracker.autorun((computation) => {
    handle = computation
    const user = Meteor.userId()

    if (user) {
      return getUser(user, dispatch)
    }

    dispatch(onBoardActions.signout())

  })

  return handle
}


@connect()
export default class Global extends Component {


  componentWillMount() {
    const { dispatch } = this.props

    const user = Meteor.userId()

    if (user) {
      return getUser(user, dispatch)
    }

    this.handle = bindLogout(dispatch)
  }


  componentWillUnmount(){
    if (this.handle) {
      this.handle.stop()
    }
  }

  render() { return <App {...this.props} /> }

}
