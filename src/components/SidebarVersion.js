import React, { Component } from 'react';
 
import { format } from 'date-fns';



function sidebarSingle(sideBarContent) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="overflow-hidden max-w-xs w-full">
        <div className="block pb-4 border-b no-underline">
          <h4 className="text-gray-800 font-bold text-sm">Eigenaar</h4>
          <p className="text-gray-700 text-sm">
            { sideBarContent ? sideBarContent.UUID : "Loading..." }
          </p>
        </div>
        <div className="block p-4 border-b no-underline">
          <p className="font-bold text-lg mb-1 text-black">Weblink</p>
          <a href={sideBarContent.Weblink} className="text-gray-700 mb-2">
            { sideBarContent ? sideBarContent.Weblink : "Loading..." }
          </a>
        </div>
        <div className="block group p-4 border-b no-underline">
          <p className="font-bold text-lg mb-1 text-black group-hover:text-white">Laatste Wijziging</p>
          <p className="text-gray-700 mb-2 group-hover:text-white">
            { sideBarContent ? format(new Date(sideBarContent.Modified_Date), 'MM/DD/YYYY') : "Loading..." }
          </p>
        </div>
        <div className="block group p-4 border-b no-underline">
          <p className="font-bold text-lg mb-1 text-black group-hover:text-white">Aangemaakt op</p>
          <p className="text-gray-700 mb-2 group-hover:text-white">
            { sideBarContent ? format(new Date(sideBarContent.Created_Date), 'MM/DD/YYYY') : "Loading..." }
          </p>
        </div>
      </div>
    </div>
  );
}


class Sidebar extends Component {

  render() {
    return (

      <div className="inline-block w-1/4">
        { console.log(this.props.ambitie) }
        <h2 className="pb-4 pt-2">Personen</h2>
        { this.props.ambitie.length !== 0 ? sidebarSingle(this.props.ambitie) : "Loading..." }
      </div>

    );
  }
}

export default Sidebar;