import React, { Component } from 'react'
import { Link } from 'react-router-dom'

function getToken() {
  return localStorage.getItem('access_token')
}

function logout() {
  // Clear user token and profile data from localStorage
  localStorage.removeItem('access_token')
}

function LoginButton() {
  return(
    <Link to={`/login`} className="bg-white block text-center hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border no-underline border-grey-light rounded shadow">
      Login
    </Link>
  )
}

function LogoutButton() {
  return(
    <Link to={`/login`} onClick={logout} className="bg-white block text-center hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border no-underline border-grey-light rounded shadow">
      Logout
    </Link>
  )
}

function LoginLogoutButton() {

  if (getToken()) {
    return <LogoutButton/>
  } else {
    return <LoginButton/>
  }

}


class Navigation extends Component {

  render() {

    return (
      
      <nav className="bg-white border-b border-gray-100 mb-12">
        <div className="bg-white py-6 container mx-auto flex items-center justify-between flex-wrap bg-white px-6">
          <div className="flex items-center flex-no-shrink text-black mr-6 py-2">
            <Link to={`/`} className="text-blue">
              <div className="main-logo"></div>
            </Link>
          </div>
          <div className="flex items-center justify-end">
            <LoginLogoutButton/>
          </div>
        </div>
      </nav>

    );
  }
}

export default Navigation;