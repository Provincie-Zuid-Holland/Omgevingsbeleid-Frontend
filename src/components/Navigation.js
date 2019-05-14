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
    <Link to={`/login`} className="bg-white block text-center hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border no-underline border-gray-400 rounded shadow">
      Login
    </Link>
  )
}

function LoggedIn() {
  return(
    <Link to={`/login`} onClick={logout} className="text-sm text-gray-800">
      Ingelogd als Aiden
    </Link>
  )
}

function LoginLogoutButton() {

  if (getToken()) {
    return <LoggedIn/>
  } else {
    return <LoginButton/>
  }

}


class Navigation extends Component {

  render() {

    return (
      
      <nav className="bg-white border-b border-gray-300 fixed w-full z-10 top-0">
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