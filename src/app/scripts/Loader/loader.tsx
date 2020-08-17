import * as React from "react";
import "../../web/styles/loader.css"
import "bootstrap"


export class Loader extends React.Component {
   render()
   { debugger;
       return(
    <div className="smart-glass">
    <h1>Xbox</h1>
    <div className="logo">
      <div className="circle">
        <div className="circle">
          <div className="circle">
          </div>
        </div>
      </div>
      <div className="hold-x">
        <div className="xbox" />
      </div>
    </div>
    <div className="loading-text">
      Please wait while the data is beign loaded
    </div>
  </div>
       );
   }
}