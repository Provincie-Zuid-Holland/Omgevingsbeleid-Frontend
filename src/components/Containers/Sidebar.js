import React, { Component } from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

function sidebarSingle(sideBarContent, type) {
    return (
        <div className="flex items-center justify-center w-full">
            <div className="overflow-hidden max-w-xs w-full">
                <div className="block pb-4 border-b no-underline">
                    <h4 className="text-gray-800 font-bold text-sm">
                        Eigenaar
                    </h4>
                    <p className="text-gray-700 text-sm">
                        {sideBarContent ? sideBarContent[0].UUID : 'Loading...'}
                    </p>
                </div>
                <div className="block py-4 border-b no-underline">
                    <h4 className="text-gray-800 font-bold text-sm">Weblink</h4>
                    <a
                        href={sideBarContent[0].Weblink}
                        className="text-gray-700 text-sm block"
                    >
                        {sideBarContent
                            ? sideBarContent[0].Weblink
                            : 'Loading...'}
                    </a>
                </div>
                <div className="block group py-4 border-b no-underline">
                    <h4 className="text-gray-800 font-bold text-sm">
                        Laatste Wijziging
                    </h4>
                    <p className="text-gray-700 text-sm">
                        {sideBarContent
                            ? format(
                                  new Date(sideBarContent[0].Modified_Date),
                                  'D MMM YYYY'
                              )
                            : 'Loading...'}
                    </p>
                </div>
                <div className="block group py-4 border-b no-underline">
                    <h4 className="text-gray-800 font-bold text-sm">
                        Aangemaakt op
                    </h4>
                    <p className="text-gray-700 text-sm">
                        {sideBarContent
                            ? format(
                                  new Date(sideBarContent[0].Created_Date),
                                  'D MMM YYYY'
                              )
                            : 'Loading...'}
                    </p>
                </div>
                <div className="block group py-4 no-underline">
                    <h4 className="text-gray-800 font-bold text-sm">
                        Revisies
                    </h4>
                    <ul className="text-gray-700 text-sm">
                        {sideBarContent
                            ? sideBarContent
                                  .slice(1)
                                  .map((sideBarContent, index) => (
                                      <li key={sideBarContent.UUID}>
                                          <span>{}</span>
                                          <Link
                                              className="text-blue"
                                              to={`/${type}/${
                                                  sideBarContent.ID
                                              }/${sideBarContent.UUID}`}
                                          >
                                              {format(
                                                  new Date(
                                                      sideBarContent.Modified_Date
                                                  ),
                                                  'D MMM YYYY'
                                              )}
                                          </Link>
                                      </li>
                                  ))
                            : 'Loading...'}
                    </ul>
                </div>
            </div>
        </div>
    )
}

class Sidebar extends Component {
    render() {
        return (
            <div className="inline-block w-1/4">
                {this.props.content.length >= 1
                    ? sidebarSingle(this.props.content, this.props.contentType)
                    : 'Loading...'}
            </div>
        )
    }
}

export default Sidebar
