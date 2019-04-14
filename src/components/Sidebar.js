import React, { Component } from 'react';
 
import { format } from 'date-fns';
import { Link } from 'react-router-dom';


function sidebarSingle(ambitie) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="overflow-hidden bg-white max-w-xs w-full">
          <div className="block p-4 border-b no-underline">
            <p className="font-bold text-lg mb-1 text-black">Eigenaar</p>
            <p className="text-grey-darker mb-2">
              { ambitie ? ambitie[0].UUID : "Loading..." }
            </p>
          </div>
          <div className="block p-4 border-b no-underline">
            <p className="font-bold text-lg mb-1 text-black">Weblink</p>
            <a href={ambitie[0].Weblink} className="text-grey-darker mb-2">
              { ambitie ? ambitie[0].Weblink : "Loading..." }
            </a>
          </div>
          <div className="block group p-4 border-b no-underline">
            <p className="font-bold text-lg mb-1 text-black group-hover:text-white">Laatste Wijziging</p>
            <p className="text-grey-darker mb-2 group-hover:text-white">
              { ambitie ? format(new Date(ambitie[0].Modified_Date), 'MM/DD/YYYY') : "Loading..." }
            </p>
          </div>
          <div className="block group p-4 border-b no-underline">
            <p className="font-bold text-lg mb-1 text-black group-hover:text-white">Aangemaakt op</p>
            <p className="text-grey-darker mb-2 group-hover:text-white">
              { ambitie ? format(new Date(ambitie[0].Created_Date), 'MM/DD/YYYY') : "Loading..." }
            </p>
          </div>
          <div className="block group p-4 no-underline">
            <p className="font-bold text-lg mb-1 text-black group-hover:text-white">Revisies</p>
            <ul className="mt-2 pl-4 text-grey-darker mb-2 group-hover:text-white">
            { ambitie ? ambitie.map(ambitie =>
              <li key={ambitie.UUID}>
                <span>{}</span>
                <Link className="text-blue" to={`/ambities/${ambitie.ID}/${ambitie.UUID}`}>
                {format(new Date(ambitie.Modified_Date), 'MM/DD/YYYY')}
                </Link>
              </li>
              ) : "Loading..."
            }
            </ul>
          </div>
      </div>
    </div>
  );
}

class Sidebar extends Component {

  render() {
    return (

      <div className="inline-block border-r pr-8 pb-6">
        { console.log("Length: " + this.props.ambitie.length)}
        <h2 className="pb-4 pt-2">Personen</h2>
        { this.props.ambitie.length >= 1 ? sidebarSingle(this.props.ambitie) : "Loading..." }
      </div>

    );
  }
}

export default Sidebar;