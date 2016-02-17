import { Component, PropTypes } from "react"

import { Controls, Forms } from "../../../../core/components"
import Validate from "../../../../core/util/validate"
import Format from "../../../../core/util/format"

export default class Payment extends Component {


  header = () => {
    return (
      <h4 className="text-center">
        Payment Details
      </h4>
    )
  }

  toggles = ["Credit Card", "Bank Account"]

  bankFields = () => {
    const { payment } = this.props.data
    return (
      <div>

        <Forms.Input
          id="accountNumber"
          name="billing-account-number"
          label="Account Number"
          type="tel"
          errorText="Please enter your account number"
          defaultValue={payment.accountNumber}
          onChange={this.saveData}
          validation={this.validate}
          ref="accountNumber"
          autofocus={true}
        />
        <Forms.Input
          id="routingNumber"
          name="billing-routing-number"
          label="Routing Number"
          type="tel"
          errorText="Please enter your routing number"
          defaultValue={payment.routingNumber}
          onChange={this.saveData}
          validation={this.validate}
          ref="routingNumber"
        />

        <div className="grid">
          <div className="grid__item one-half">
            <Forms.Input
              name="billing-account-name"
              ref="accountName"
              id="accountName"
              label="Bank Name"
              onChange={this.saveData}
              validation={this.validate}
              defaultValue={payment.accountName}
              errorText="Please enter your bank number"
            />
          </div>
          <div className="grid__item one-half">
            <Forms.Select
              name="billing-account-type"
              ref="accountType"
              id="accountType"
              label="Account Type"
              onChange={this.saveData}
              validation={this.validate}
              defaultValue={payment.accountType}
              errorText="Please choose your account type"
              includeBlank={true}
              items={[
                { value: "checking", label: "Checking" },
                { value: "savings", label: "Savings" },
              ]}
            />
          </div>
        </div>

      </div>

    )
  }

  validate = (value, target) => {
    const { id } = target

    let isValid = false
    let notEmpty = (value) => (value.length > 0)
    const validationMap = {
      accountNumber: notEmpty,
      routingNumber: notEmpty,
      accountType: notEmpty,
      accountName: notEmpty,
      cardNumber: Validate.isCreditCard,
      expiration: notEmpty,
      ccv: Validate.isCCV
    }

    isValid = validationMap[id](value)

    // special case for intial repaint
    if ((id === "cardNumber" || id === "accountNumber") && !value) {
      return true
    }


    return isValid
  }

  saveData = (value, target) => {
    const { id } = target

    let isValid = this.validate(value, target)

    if (isValid) {
      this.props.save({ payment: { [id]: value }})
    } else {
      this.props.clear("payment", id)
    }

  }

  formatExp = (str, target, event) => {

    let save = (adjusted) => {
      this.saveData(adjusted, target)
      return adjusted
    }

    let current = this.props.data.payment.expiration
    current || (current = "")
    str = `${str}`

    if (str.length > 5) {
      return save(str.slice(0, 5))
    }

    let copy = str
    const lastNumber = copy.slice(-1)
    const currentLastNumber = current.slice(-1)

    if (lastNumber === "/" && str.length === 1) {
      return save(`0${str}/`)
    }

    if (lastNumber === "/" && str.length === 2 && currentLastNumber != "/") {
      return save(`${str}/`)
    }

    if (str.length === 2 && lastNumber != "/" && currentLastNumber != "/") {
      return save(`${str}/`)
    }

    if (str.length === 4 && (lastNumber === "/")) {
      return save(str.slice(0, 3))
    }

    return save(str)

  }

  cardFields = () => {
    const { payment } = this.props.data
    return (
      <div>
        <Forms.Input
          name="billing-cc-number"
          id="cardNumber"
          label="Card Number"
          type="tel"
          errorText="Please enter your card number"
          defaultValue={payment.cardNumber}
          format={Format.creditCard}
          onChange={this.saveData}
          validation={this.validate}
          ref="cardNumber"
        />
        <div className="grid">
          <div className="grid__item one-half">
            <Forms.Input
              id="expiration"
              name="billing-cc-exp"
              label="Exp (MM/YY)"
              type="tel"
              errorText="Please enter a valid expiration number"
              defaultValue={payment.expiration}
              format={this.formatExp}
              onChange={this.saveData}
              validation={(value) => (value.length > 0)}
              ref="expiration"
              data-expiry-input={true}
            />
          </div>
          <div className="grid__item one-half">
            <Forms.Input
              id="ccv"
              name="billing-cvv"
              label="CCV"
              type="number"
              errorText="Please enter a valid ccv number"
              defaultValue={payment.ccv}
              onChange={this.saveData}
              validation={this.validate}
              ref="ccv"
            />
          </div>
        </div>
      </div>

    )
  }

  toggle = () => {
    let type = "ach"
    if (this.props.data.payment.type === type) {
      type = "cc"
    }

    this.props.save({ payment: { type } })
  }

  render () {
    const { payment } = this.props.data
    return (
      <div>
        <div className="push-double@lap-and-up push">
          {this.props.header || this.header()}
        </div>

        {this.props.children}

        <Controls.Toggle
          items={this.props.toggles || this.toggles}
          state={payment.type === "ach"}
          toggle={this.toggle}
        />


        <div className="soft">
          {() => {
            if (payment.type === "ach") {
              return this.bankFields()
            } else {
              return this.cardFields()
            }
          }()}

        </div>


        <div>
          <a href="#" tabIndex={-1} onClick={this.props.back} className="btn--small btn--dark-tertiary display-inline-block">
            Back
          </a>

          {() => {
            const { billing } = this.props.data
            let btnClasses = ["push-left"];

            const ach = (payment.type === "ach" && payment.accountNumber && payment.routingNumber)
            const cc = (payment.type === "cc" && payment.cardNumber && payment.expiration && payment.ccv)


            let submit = this.props.next
            if (ach || cc){
              btnClasses.push("btn")
              submit = this.props.next
            } else {
              btnClasses.push("btn--disabled");
              submit = (e) => (e.preventDefault())
            }

            return (
              <button  className={btnClasses.join(" ")} type="submit" onClick={submit}>
                Next
              </button>
            )
          }()}

        </div>

      </div>
    )
  }
}
