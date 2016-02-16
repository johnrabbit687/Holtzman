import { Component } from "react"
import { connect } from "react-redux"

import { onBoard as onBoardActions } from "../../../core/store"

import Layout from "./Layout"

import Menu from "./Menu"
import ChangePassword from "./ChangePassword"
import PersonalDetails from "./PersonalDetails"
import HomeAddress from "./HomeAddress"
import PaymentDetails from "./Payments"
import PP from "./PrivacyPolicy"


const map = (state) => ({ person: state.onBoard.person })

@connect(map)
class Template extends Component {

  render() {
    const { person } = this.props
    let { photo } = person
    // photo = photo ? `//core-rock.newspring.cc/${photo}` : null

    return (
      <Layout photo={photo} person={person} >
        {this.props.children}
      </Layout>
    )
  }
}


const Routes = [
  {
    path: "settings",
    component: Template,
    indexRoute: {
      component: Menu
    },
    childRoutes: [
      { path: "change-password", component: ChangePassword },
      { path: "personal-details", component: PersonalDetails },
      { path: "home-address", component: HomeAddress },
      { path: "saved-accounts", component: PaymentDetails },
      { path: "privacy-policy", component: PP },
    ]
  }
]

export default {
  Template,
  Routes
}