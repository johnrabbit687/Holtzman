import { Component, PropTypes} from "react"
import ReactDom from "react-dom"
import { connect } from "react-redux"
import Moment from "moment"

import { GraphQL } from "../../../core/graphql"
import { Controls, Forms } from "../../../core/components"
import { OnBoard } from "../../../core/blocks"
import {
  modal,
  campuses as campusActions,
  collections as collectionActions
 } from "../../../core/store"


import { give as giveActions } from "../../store"

import { Personal, Payment, Billing, Confirm} from "./fieldsets"
import Loading from "./Loading"
import Err from "./Err"
import Success from "./Success"


// We only care about the give state
const map = (state) => ({
  give: state.give,
  person: state.onBoard.person,
  campuses: state.campuses.campuses,
  states: state.collections.states
})

@connect(map)
export default class Give extends Component {

  componentWillMount() {
    const { savedAccount } = this.props.give

    this.updateData()

    if (!savedAccount.id) {
      return
    }

    this.props.dispatch(giveActions.setProgress(4))
  }


  componentWillUnmount(){
    if (this.props.give.state != "default") {
      this.props.dispatch(giveActions.clearData())
    }
  }

  componentDidMount() {

    const { dispatch } = this.props

    let query = `
      {
        states: allDefinedValues(id: 28) {
          name: description
          value
          id
        }
      }
    `

    GraphQL.query(query)
      .then(({ states }) => {
        let stateObj = {}

        for (let state of states) {
          stateObj[state.id] = state
        }

        dispatch(collectionActions.insert("states", stateObj))

      })
  }

  updateData = () => {

    const { person } = this.props

    let { campus, home } = person
    campus || (campus = {})
    home || (home = {})

    const mappedPerson = {
      personal: {
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        campus: campus.name
      },
      billing: {
        streetAddress: home.street1,
        streetAddress2: home.street2,
        city: home.city,
        state: home.state,
        zip: home.zip
      }
    }

    this.props.dispatch(giveActions.save(mappedPerson))

  }

  onSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props

    dispatch(giveActions.submit())
  }

  goBack = (e) => {
    e.preventDefault();
    if (typeof window != "undefined" && window != null) {
      window.history.back()
    }

  }

  next = (e) => {
    e.preventDefault()
    this.props.dispatch(giveActions.next())
  }

  back = (e) => {
    e.preventDefault()
    if (this.props.give.step === 1) {
      this.props.dispatch(modal.hide())
      return
    }

    this.props.dispatch(giveActions.previous())
  }

  monentize = (value, fixed) => {

    if (typeof value === "number") {
      value = `${value}`
    }

    if (!value.length) {
      return `$0.00`
    }

    value = value.replace(/[^\d.-]/g, "")

    let decimals = value.split(".")[1]
    if ((decimals && decimals.length >= 2) || fixed) {
      value = Number(value).toFixed(2)
      value = String(value)
    }

    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return `$${value}`
  }

  goToOnboard = () => {
    const { data } = this.props.give

    let props = {
      account: false,
      data: {
        email: data.personal.email,
        firstName: data.personal.firstName,
        lastName: data.personal.lastName,
        terms: true
      }
    }

    this.props.dispatch(modal.render(OnBoard, props))
  }

  render () {
    const {
      data,
      errors,
      step,
      transactions,
      schedules,
      total,
      savedAccount,
      state,
      transactionType
    } = this.props.give

    let campuses = []
    for (let campus in this.props.campuses) {
      campuses.push(this.props.campuses[campus])
    }

    campuses = campuses.map((x) => ({
      label: x.name,
      value: x.name
    }))

    let states = []
    for (let state in this.props.states) {
      states.push(this.props.states[state])
    }

    states = states.map((x) => ({
      label: x.name,
      value: x.value
    }))


    let save = (...args) => { this.props.dispatch(giveActions.save(...args)) }
    let clear = (...args) => { this.props.dispatch(giveActions.clear(...args)) }

    switch (state) {
      case "loading":
        return <Loading msg="We're Processing Your Gift" />
      case "error":
        return <Err msg={errors[Object.keys(errors)[0]].error} />
      case "success":
        return <Success
          total={this.monentize(total)}
          email={data.personal.email}
          guest={transactionType === "guest"}
          onClick={this.goToOnboard}
        />
      default:
        let Step;

        switch (step) {
          case 4:
            Step = Confirm
            break;
          case 3:
            Step = Payment
            break;
          case 2:
            Step = Billing
            break;
          default:
            Step = Personal
        }

        return (
          <Forms.Form
            id="give"
            theme="hard"
            fieldsetTheme="flush soft-top"
            ref="form"
            method="POST"
            submit={this.onSubmit}
          >

            <Step
              data={data}
              savedAccount={savedAccount}
              transactions={transactions}
              transactionType={transactionType}
              save={save}
              errors={errors}
              clear={clear}
              next={this.next}
              back={this.back}
              ref="inputs"
              total={total}
              campuses={campuses}
              states={states}
              schedules={schedules}
            >
              <Controls.Progress
                steps={4}
                active={step}
              />
            </Step>


          </Forms.Form>
        )
    }
  }
}