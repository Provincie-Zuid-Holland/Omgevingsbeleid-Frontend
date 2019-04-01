import React, { Component } from 'react';
 
import { format } from 'date-fns';

function parseDate(dateString){
  return new Date(dateString);
}

class Sidebar extends Component {

  render() {
    return (
      <div className="inline-block border-r pr-8 pb-6">      
        <h2 className="pb-4 pt-2">Personen</h2>
        <div className="flex items-center justify-center w-full">
          <div className="overflow-hidden bg-white max-w-xs w-full">
              <div className="block p-4 border-b no-underline">
                <p className="font-bold text-lg mb-1 text-black">Eigenaar</p>
                <p className="text-grey-darker mb-2">
                  {this.props.ambitie[0] ? this.props.ambitie[0].UUID : "Loading..." }
                </p>
              </div>
              <div className="block group p-4 border-b no-underline">
                <p className="font-bold text-lg mb-1 text-black group-hover:text-white">Aangemaakt op</p>
                <p className="text-grey-darker mb-2 group-hover:text-white">
                  {this.props.ambitie[0] ? format(new Date(this.props.ambitie[0].Created_Date), 'MM/DD/YYYY') : "Loading..." }
                </p>
              </div>
              <div className="block group p-4 no-underline">
                <p className="font-bold text-lg mb-1 text-black group-hover:text-white">Laatste Wijziging</p>
                <p className="text-grey-darker mb-2 group-hover:text-white">
                  {this.props.ambitie[0] ? format(new Date(this.props.ambitie[0].Modified_Date), 'MM/DD/YYYY') : "Loading..." }
                </p>
              </div>
          </div>
        </div>

        

      </div>

    );
  }
}

export default Sidebar;