import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

class RevisieOverzicht extends React.Component {

  render() {
    return (
      
        <div className="block group py-2 no-underline">
            <h4 className="text-gray-800 font-bold text-sm">Revisies</h4>
            <ul className="text-gray-700 text-sm">
            { this.props.revisieObject.slice(1).map((revisieObject, index) =>
                <li key={revisieObject.UUID}>
                    <Link className="text-blue" to={`/${this.props.overzichtSlug}/${revisieObject.ID}/${revisieObject.UUID}`}>
                    {format(new Date(revisieObject.Modified_Date), 'D MMM YYYY')}
                    </Link>
                </li>
                )
            }
            </ul>
        </div> 

    );
  }

}


export default RevisieOverzicht;