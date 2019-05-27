import React from 'react';
import { format } from 'date-fns';

class Datum extends React.Component {

  render() {
    return (
      
        <div className="block group py-4 border-b no-underline">
            <h4 className="text-gray-800 font-bold text-sm">{ this.props.UITitle }</h4>
            <p className="text-gray-700 text-sm">
                {format(new Date(this.props.UIContent), 'D MMM YYYY')}
            </p>
        </div>

    );
  }

}

export default Datum;