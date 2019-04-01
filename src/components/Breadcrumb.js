import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

function BreadcrumbMaker(location){

  console.log(location)
  console.log(location.includes("/ambities/"))

  if (!location.includes("/ambities/")) {
    console.log("OVERZICHT");
    return(
      <ol className="list-reset flex text-grey-dark ml-4">
        <li><a href="#" className="text-blue">Home</a></li>
        <li><span className="mx-2">/</span></li>
        <li>
          <span>Ambities</span>
        </li>
        <li><span className="mx-2">/</span></li>
        <li>{console.log(location)}</li>
      </ol>
    )
  } else if (location.includes("/ambities/")) {
    console.log("SINGLE");
    return(
      <ol className="list-reset flex text-grey-dark ml-4">
        <li><a href="#" className="text-blue">Home</a></li>
        <li><span className="mx-2">/</span></li>
        <li>
          <Link to={`/ambities`} className="text-blue">
            Ambities
          </Link>
        </li>
        <li><span className="mx-2">/</span></li>
        <li>{console.log(location)}</li>
      </ol>
    )
  }
}

class Breadcrumb extends Component {
  
  render() {
    return (
      <div className="bg-grey-light p-3 rounded font-sans w-full m-4 container mx-auto">
        {BreadcrumbMaker(this.props.location.pathname)}
        {console.log(this.props.location)}
      </div>

    );
  }
}

export default withRouter(Breadcrumb);