import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create();

// Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTM1MDY4MjYsIm5iZiI6MTU1MzUwNjgyNiwianRpIjoiYzFjZWJiYWUtMGJmNC00N2NkLTk4ZTAtZWJmMWE2OGYxODljIiwiZXhwIjoxNTUzNTEwNDI2LCJpZGVudGl0eSI6Ik14X0NhcCIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.O6TU5ZzlcrtXee_uJwfVhwrjrtzRqBkXWkcH6skB5NY";


class AmbitionsList extends Component {

  render() {
    return (
      <div className="container mx-auto flex">
				<div className="p-8 w-3/4 bg-white shadow rounded inline-block flex-grow">
					<h1>Voeg een nieuwe ambitie toe</h1>
				</div>
			</div>
    )
  }

}

export default AmbitionsList;