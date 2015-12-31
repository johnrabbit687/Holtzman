import { Component, PropTypes} from "react"
import { connect } from "react-redux"
import { Link } from "react-router"
import ReactMixin from "react-mixin"
import Moment from "moment"

import { Forms } from "../../../../core/client/components"
import { Campuses } from "../../../../rock/lib/collections"

import { nav } from "../../../../core/client/actions"

const map = (state) => ({ person: state.onBoard.person })

@connect(map)
export default class HomeAddress extends Component {

  componentWillMount(){
    this.props.dispatch(nav.setLevel("CONTENT"))
  }

  componentWillUnmount(){
    this.props.dispatch(nav.setLevel("TOP"))
  }


  render () {

    let {
      City,
      Country,
      PostalCode,
      State,
      Street1,
      Street2
    } = this.props.person.Home

    return (
      <div className="one-whole text-center push-double-top@lap-and-up">
        <Forms.Form
          id="reset-password"
          classes={["soft", "one-whole", "two-thirds@portable", "one-half@anchored", "display-inline-block"]}
        >
          <div className="push-double">
            <h4 className="text-center">
              My Home Address
            </h4>
          </div>

          <Forms.Input
            name="Street1"
            label="Street"
            ref="Street1"
            type="text"
            defaultValue={Street1}
          />
          <Forms.Input
            name="Street2"
            label="Street 2 (Optional)"
            ref="Street2"
            type="text"
            defaultValue={Street2}
          />
          <div className="grid">

            <div className="grid__item two-fifths">
              <Forms.Input
                name="City"
                label="City"
                defaultValue={City}
                ref="City"
              />
            </div>

            <div className="grid__item three-fifths">

              <div className="grid">

                <div className="grid__item one-half">
                  <Forms.Input
                    name="State"
                    label="State"
                    defaultValue={State}
                    ref="State"
                  />

                </div>
                <div className="grid__item one-half">
                  <Forms.Input
                    name="PostalCode"
                    label="Zip"
                    defaultValue={PostalCode}
                    ref="PostalCode"
                  />
                </div>
              </div>
            </div>
          </div>

          <Link to="/profile/settings" tabIndex={-1} className="btn--small btn--dark-tertiary display-inline-block">
            Back
          </Link>

          {() => {
            let btnClasses = ["push-left"];
            let ready = true
            if (!ready){
              btnClasses.push("btn--disabled");
            } else {
              btnClasses.push("btn");
            }

            return (
              <button className={btnClasses.join(" ")}>
                Update
              </button>
            )
          }()}
        </Forms.Form>
      </div>
    )
  }
}
