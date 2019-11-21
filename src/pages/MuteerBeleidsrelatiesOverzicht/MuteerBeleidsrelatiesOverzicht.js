import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import axios from './../../API/axios'

import ContainerMain from './../../components/ContainerMain'
import SidebarMain from './../../components/SidebarMain'
import MuteerBeleidsrelatieDetail from './MuteerBeleidsrelatieDetail'

// 1. GET All beleidsbeslissingen
// 2. GET All beleidsrelaties
// 3. Maak nieuw object wat we kunnen outputten naar de view
// -> Return een array met voor elk van de beleidsbeslissingen een object met daar in:
// -> Titel, Status, het aantal Bevestigde, het aantal Onbevestigde, UUID

class MuteerBeleidsrelatiesOverzicht extends Component {
    constructor(props) {
        super(props)
        this.state = {
            beleidsbeslissingen: null,
            beleidsrelaties: null,
            dataLoaded: false,
            beleidsbeslissingenObject: null,
            currentView: 'overzicht',
            currentUUID: null,
        }
        this.initializeState = this.initializeState.bind(this)
        this.getBevestigdeRelaties = this.getBevestigdeRelaties.bind(this)
        this.getOnbevestigdeRelaties = this.getOnbevestigdeRelaties.bind(this)
        this.getVerzoekRelaties = this.getVerzoekRelaties.bind(this)
        this.getRelatieArray = this.getRelatieArray.bind(this)
        this.getVerzoekArray = this.getVerzoekArray.bind(this)
    }

    getBevestigdeRelaties(UUID) {
        // Kijkt hoeveel bevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
        const beleidsrelaties = this.state.beleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Van_Beleidsbeslissing === UUID ||
                    beleidsrelatie.Naar_Beleidsbeslissing === UUID) &&
                beleidsrelatie.Status === 'Akkoord'
        )
        return beleidsrelaties.length
    }

    getOnbevestigdeRelaties(item, UUID) {
        // Kijkt hoeveel onbevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID

        console.log('ITEM:')
        console.log(item)
        console.log('UUID:')
        console.log(UUID)

        const beleidsrelaties = this.state.beleidsrelaties.filter(
            beleidsrelatie => {
                console.log('----')
                console.log(beleidsrelatie)
                console.log(beleidsrelatie.Van_Beleidsbeslissing)
                console.log(beleidsrelatie.Van_Beleidsbeslissing === UUID)
                if (
                    beleidsrelatie.Van_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'Open'
                ) {
                    return beleidsrelatie
                }
            }
        )
        console.log(beleidsrelaties)
        return beleidsrelaties.length
    }

    getVerzoekRelaties(UUID) {
        // Kijkt hoeveel onbevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
        const beleidsrelaties = this.state.beleidsrelaties.filter(
            beleidsrelatie =>
                beleidsrelatie.Naar_Beleidsbeslissing === UUID &&
                beleidsrelatie.Status === 'Open'
        )
        return beleidsrelaties.length
    }

    initializeState() {
        // Map over alle beleidsbeslissingen en return een array met voor elke beleidsbeslissing een object met:
        // Titel, Status, het aantal Bevestigde, het aantal Onbevestigde, UUID

        const beleidsbeslissingenArray = this.state.beleidsbeslissingen.map(
            item => {
                return {
                    Titel: item.Titel,
                    Status: item.Status,
                    UUID: item.UUID,
                    Bevestigd: this.getBevestigdeRelaties(item.UUID),
                    Onbevestigd: this.getOnbevestigdeRelaties(item, item.UUID),
                    Verzoeken: this.getVerzoekRelaties(item.UUID),
                    RelatieArray: this.getRelatieArray(item.UUID),
                    VerzoekArray: this.getVerzoekArray(item.UUID),
                }
            }
        )

        this.setState(
            {
                beleidsbeslissingenObject: beleidsbeslissingenArray,
            },
            () => console.log(this.state)
        )
    }

    getRelatieArray(UUID) {
        let beleidsrelaties = this.state.beleidsrelaties.filter(
            beleidsrelatie =>
                ((beleidsrelatie.Van_Beleidsbeslissing === UUID ||
                    beleidsrelatie.Naar_Beleidsbeslissing === UUID) &&
                    beleidsrelatie.Status === 'Akkoord') ||
                (beleidsrelatie.Van_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'Open')
        )

        beleidsrelaties.forEach(relatie => {
            if (relatie.Van_Beleidsbeslissing !== UUID) {
                axios
                    .get(
                        `/beleidsbeslissingen/version/${relatie.Van_Beleidsbeslissing}
                        }`
                    )
                    .then(res => {
                        relatie.beleidsrelatieGekoppeldObject = res.data
                        return res.data
                    })
            } else {
                axios
                    .get(
                        `/beleidsbeslissingen/version/${relatie.Naar_Beleidsbeslissing}
                        }`
                    )
                    .then(res => {
                        relatie.beleidsrelatieGekoppeldObject = res.data
                        return res.data
                    })
            }
        })

        return beleidsrelaties
    }

    getVerzoekArray(UUID) {
        let beleidsrelaties = this.state.beleidsrelaties.filter(
            beleidsrelatie =>
                beleidsrelatie.Naar_Beleidsbeslissing === UUID &&
                beleidsrelatie.Status === 'Open'
        )

        beleidsrelaties.forEach(relatie => {
            if (relatie.Van_Beleidsbeslissing !== UUID) {
                axios
                    .get(
                        `/beleidsbeslissingen/version/${relatie.Van_Beleidsbeslissing}
                        }`
                    )
                    .then(res => {
                        relatie.beleidsrelatieGekoppeldObject = res.data
                        return res.data
                    })
            } else {
                axios
                    .get(
                        `/beleidsbeslissingen/version/${relatie.Naar_Beleidsbeslissing}
                        }`
                    )
                    .then(res => {
                        relatie.beleidsrelatieGekoppeldObject = res.data
                        return res.data
                    })
            }
        })

        return beleidsrelaties
    }

    componentDidMount() {
        // get beleidsbeslissingen van de gebruiker
        axios
            .get(
                `/beleidsbeslissingen?Created_By=${
                    JSON.parse(localStorage.getItem('identifier')).UUID
                }`
            )
            .then(res => {
                this.setState(
                    {
                        beleidsbeslissingen: res.data,
                    },
                    () =>
                        axios.get(`/beleidsrelaties`).then(res => {
                            this.setState(
                                {
                                    beleidsrelaties: res.data,
                                    dataLoaded: true,
                                },
                                () => {
                                    this.initializeState()
                                }
                            )
                        })
                )
            })
    }

    render() {
        return (
            <ContainerMain>
                <Helmet>
                    <title>Omgevingsbeleid - Beleidsrelaties</title>
                </Helmet>

                {this.state.currentView === 'overzicht' ? (
                    <React.Fragment>
                        <SidebarMain />
                        <div className="w-3/4 rounded inline-block flex-grow pl-8">
                            <h2 className="heading-serif text-gray-800 mb-4">
                                Beleidsrelaties
                            </h2>
                            <div className="bg-white shadow rounded p-5">
                                <ul>
                                    <li className="flex border-b border-gray-200 text-sm font-semibold text-gray-800 py-2">
                                        <div className="w-6/12 pl-10">
                                            Beleidsbeslissingen
                                        </div>
                                        <div className="w-2/12">Status</div>
                                        <div className="w-2/12">Bevestigde</div>
                                        <div className="w-2/12">
                                            Onbevestigde
                                        </div>
                                        <div className="w-2/12">Verzoeken</div>
                                    </li>
                                    {console.log(this.state)}
                                    {this.state.beleidsbeslissingenObject !==
                                    null
                                        ? this.state.beleidsbeslissingenObject.map(
                                              item => {
                                                  return (
                                                      <li key={item.UUID}>
                                                          <Link
                                                              className="flex border-b border-gray-200 text-sm text-gray-800 py-2 relative items-center hover:bg-gray-100"
                                                              to={`/muteer/beleidsrelaties/${item.UUID}`}
                                                              onClick={() =>
                                                                  this.setState(
                                                                      {
                                                                          currentBeleidsbeslissing: item,
                                                                          currentView:
                                                                              'Detail',
                                                                      }
                                                                  )
                                                              }
                                                          >
                                                              <span className="h-3 w-3 mbg-color rounded-full absolute ml-3 inline-block"></span>
                                                              <div className="w-6/12 pl-10">
                                                                  {item.Titel}
                                                              </div>
                                                              <div className="w-2/12">
                                                                  <span className="border m-color m-base-border-color px-1 py-1 text-xs rounded">
                                                                      Vigerend
                                                                  </span>
                                                              </div>
                                                              <div className="w-2/12">
                                                                  {item.Bevestigd !==
                                                                  0
                                                                      ? item.Bevestigd
                                                                      : '-'}
                                                              </div>
                                                              <div className="w-2/12">
                                                                  {item.Onbevestigd !==
                                                                  0
                                                                      ? item.Onbevestigd
                                                                      : '-'}
                                                              </div>
                                                              <div className="w-2/12">
                                                                  {item.Verzoeken !==
                                                                  0
                                                                      ? item.Verzoeken
                                                                      : '-'}
                                                              </div>
                                                              <FontAwesomeIcon
                                                                  className="absolute text-gray-700 right-0 h-8 mr-3"
                                                                  icon={
                                                                      faAngleRight
                                                                  }
                                                              />
                                                          </Link>
                                                      </li>
                                                  )
                                              }
                                          )
                                        : null}
                                </ul>
                            </div>
                        </div>
                    </React.Fragment>
                ) : (
                    <MuteerBeleidsrelatieDetail
                        beleidsbeslissing={this.state.currentBeleidsbeslissing}
                        backToOverzicht={() => {
                            this.setState({
                                currentView: 'overzicht',
                                currentUUID: null,
                            })
                        }}
                    />
                )}
            </ContainerMain>
        )
    }
}

export default MuteerBeleidsrelatiesOverzicht
