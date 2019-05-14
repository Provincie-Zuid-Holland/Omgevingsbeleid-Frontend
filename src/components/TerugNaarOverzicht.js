import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class TerugNaarOverzicht extends Component {
  
  render() {
    return (
      
      <div className="px-6 text-gray-600 text-sm font-sans w-full container mx-auto">
        <ul>
          <li>
            <Link to="/" className="text-blue">
              Terug naar overzicht
            </Link>
          </li>
        </ul>
      </div>

    );
  }
}

export default TerugNaarOverzicht;