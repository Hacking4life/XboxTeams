
import * as React from "react";
import "../../web/styles/Connect.css"
import * as querystring from "querystring";
import * as https from "https";
import "bootstrap"


export class ClubForm extends React.Component<{}, {}> {
  constructor(props) {
    super(props)
  }
  render() {

    return (
      <div className="modal fade" id="modalLoginForm" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h4 className="modal-title w-100 font-weight-bold">Club</h4>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body mx-3">
              <div className="md-form mb-5">
                <i className="fas fa-envelope prefix grey-text" />
                <input type="email" id="defaultForm-email" className="form-control validate" />
                <label data-error="wrong" data-success="right" htmlFor="defaultForm-email">Enter your club Name</label>
              </div>
              <div className="md-form mb-4">
                <i className="fas fa-lock prefix grey-text" />
                <textarea id="defaultForm-pass" className="form-control validate" />
                <label data-error="wrong" data-success="right" htmlFor="defaultForm-pass">Description</label>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button className="btn btn-default">Login</button>
            </div>
          </div>
        </div>
      </div>
    )
  }




}