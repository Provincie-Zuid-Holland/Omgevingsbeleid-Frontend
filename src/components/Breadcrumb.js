import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

function BreadcrumbMaker(location){

  if (location.includes("/ambities") && !location.includes("/ambities/")) {
    return(
      <ol className="flex text-grey-dark ml-4">
        <li>
          <Link to={`/`} className="text-blue">
            Home
          </Link>
        </li>
        <li><span className="mx-2">/</span></li>
        <li>
          <span>Ambities</span>
        </li>
      </ol>
    )
  } else if (location.includes("/ambities/nieuwe-ambitie")) {
    return(
      <ol className="flex text-grey-dark ml-4">
        <li>
          <Link to={`/`} className="text-blue">
            Home
          </Link>
        </li>
        <li><span className="mx-2">/</span></li>
        <li>
          <Link to={`/ambities`} className="text-blue">
            Ambities
          </Link>
        </li>
        <li><span className="mx-2">/</span></li>
        <li>
          Nieuwe Ambitie
        </li>
      </ol>
    )
  } else if (location.includes("/ambities/:number")) {
    return(
      <ol className="flex text-grey-dark ml-4">
        <li>
          <Link to={`/`} className="text-blue">
            Home
          </Link>
        </li>
        <li><span className="mx-2">/</span></li>
        <li>
          <Link to={`/ambities`} className="text-blue">
            Ambities
          </Link>
        </li>
        <li><span className="mx-2">/</span></li>
        <li><span>Ambitie Detail</span></li>
      </ol>
    )
  } else if (location.includes("/login")) {
    return(
      <ol className="flex text-grey-dark ml-4">
        <li>
          <span className="text-blue underline cursor-not-allowed">
            Home
          </span>
        </li>
        <li><span className="mx-2">/</span></li>
        <li>
          Login
        </li>
      </ol>
    )
  } else {
    return(
      <ol className="flex text-grey-dark ml-4">
        <li>
          <span className="text-grey-dark cursor-not-allowed">
            Home
          </span>
        </li>
      </ol>
    )
  } 
}

class Breadcrumb extends Component {
  
  render() {
    return (
      <div className="bg-grey-light p-3 rounded font-sans w-full m-4 container mx-auto">
        {BreadcrumbMaker(this.props.location.pathname)}
      </div>

    );
  }
}

export default withRouter(Breadcrumb);