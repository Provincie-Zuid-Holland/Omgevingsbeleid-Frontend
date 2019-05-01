import React, { Component } from 'react';
 
import { format } from 'date-fns';

function sidebarSingle(ambitie) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="overflow-hidden bg-white max-w-xs w-full">
          <div className="block p-4 border-b no-underline">
            <p className="font-bold text-lg mb-1 text-black">Eigenaar</p>
            <p className="text-grey-darker mb-2">
              { ambitie ? ambitie.UUID : "Loading..." }
            </p>
          </div>
          <div className="block p-4 border-b no-underline">
            <p className="font-bold text-lg mb-1 text-black">Weblink</p>
            <a href={ambitie.Weblink} className="text-grey-darker mb-2">
              { ambitie ? ambitie.Weblink : "Loading..." }
            </a>
          </div>
          <div className="block group p-4 border-b no-underline">
            <p className="font-bold text-lg mb-1 text-black group-hover:text-white">Laatste Wijziging</p>
            <p className="text-grey-darker mb-2 group-hover:text-white">
              { ambitie ? format(new Date(ambitie.Modified_Date), 'MM/DD/YYYY') : "Loading..." }
            </p>
          </div>
          <div className="block group p-4 border-b no-underline">
            <p className="font-bold text-lg mb-1 text-black group-hover:text-white">Aangemaakt op</p>
            <p className="text-grey-darker mb-2 group-hover:text-white">
              { ambitie ? format(new Date(ambitie.Created_Date), 'MM/DD/YYYY') : "Loading..." }
            </p>
          </div>
      </div>
    </div>
  );
}


class Sidebar extends Component {

  render() {
    return (

      <div className="inline-block border-r pr-8 pb-6">
        { console.log(this.props.ambitie) }
        <h2 className="pb-4 pt-2">Personen</h2>
        { this.props.ambitie.length !== 0 ? sidebarSingle(this.props.ambitie) : "Loading..." }
      </div>

    );
  }
}

export default Sidebar;