import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navigation extends Component {
  render() {
    return (
      
      <nav className="bg-white shadow">
        <div  className="bg-white container mx-auto flex items-center justify-between flex-wrap bg-white px-6 mb-8">
          <div className="flex items-center flex-no-shrink text-black mr-6 py-2">
            <Link to={`/ambities`} className="text-blue">
              <img alt="Logo" className="h-24" src="https://www.zuid-holland.nl/publish/library/25/pzh_groot_jpg.jpg" />
            </Link>
          </div>
          <div className="flex items-center justify-end">
            <div className="">
              <Link to={`/login`} className="bg-white mt-4 block text-center hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border no-underline border-grey-light rounded shadow">Login</Link>
            </div>
          </div>
        </div>
      </nav>

    );
  }
}

export default Navigation;