import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Axios instance to connect with the API
import axios from '../../../API/axios'

import LoaderSmallSpan from './../../../components/LoaderSmallSpan'

class RelatieKoppelingenComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.initializeComponent = this.initializeComponent.bind(this)
    }

    initializeComponent() {
        const crudObject = this.props.crudObject

        // ***
        // Haal beleidsrelaties op
        axios
            .get(`/beleidsrelaties?Van_Beleidsbeslissing=${crudObject.UUID}`)
            .then((res) => {
                let beleidsrelaties = res.data

                if (res.data.length > 0) {
                    const axiosGETArray = res.data.map((relatie) => {
                        return axios
                            .get(
                                `/beleidsbeslissingen/version/${relatie.Naar_Beleidsbeslissing}`
                            )
                            .then((response) => {
                                relatie.data = response.data
                            })
                    })

                    const that = this

                    Promise.all(axiosGETArray).then(function (values) {
                        let newObject = that.state.koppelingenRelaties
                        if (
                            newObject.beleidsbeslissingen &&
                            newObject.beleidsbeslissingen.length > 0
                        ) {
                            newObject.beleidsbeslissingen.concat(
                                beleidsrelaties
                            )
                        } else {
                            newObject.beleidsbeslissingen = beleidsrelaties
                        }
                        that.setState({
                            koppelingenRelaties: newObject,
                        })
                    })
                }
            })

        axios
            .get(`/beleidsrelaties?Naar_Beleidsbeslissing=${crudObject.UUID}`)
            .then((res) => {
                let beleidsrelaties = res.data

                if (res.data.length > 0) {
                    const axiosGETArray = res.data.map((relatie) => {
                        return axios
                            .get(
                                `/beleidsbeslissingen/version/${relatie.Van_Beleidsbeslissing}`
                            )
                            .then((response) => {
                                relatie.data = response.data
                            })
                    })

                    const that = this

                    Promise.all(axiosGETArray).then(function (values) {
                        let newObject = that.state.koppelingenRelaties
                        if (
                            newObject.beleidsbeslissingen &&
                            newObject.beleidsbeslissingen.length > 0
                        ) {
                            newObject.beleidsbeslissingen.concat(
                                beleidsrelaties
                            )
                        } else {
                            newObject.beleidsbeslissingen = beleidsrelaties
                        }
                        that.setState({
                            koppelingenRelaties: newObject,
                        })
                    })
                }
            })

        // ***
        // Haal alle koppelingen en relaties op
        const koppelingRelatieArray = [
            'ambities',
            'opgaven',
            'themas',
            'beleidsregels',
            'doelen',
            'maatregelen',
            'verordening',
        ]

        let actieveKoppelingOfRelaties = []

        // Voor elk item in de koppelingRelatieArray kijken we of deze al een actieve koppeling heeft op het gekregen crudObject
        koppelingRelatieArray.forEach((item) => {
            const propertyName = objecten[item].propertyName
            if (
                crudObject[propertyName] !== undefined &&
                crudObject[propertyName] !== null &&
                crudObject[propertyName].length > 0 &&
                !actieveKoppelingOfRelaties.includes(
                    objecten[item].propertyName
                )
            ) {
                actieveKoppelingOfRelaties.push(objecten[item].propertyName)
            }
        })

        let propertyNamesMapped = []

        // Het object waar de nieuwe koppeling en relatie state in gemaakt wordt
        let newStateKoppelingenRelatiesObject = {}

        actieveKoppelingOfRelaties.forEach((propertyName) => {
            // Als er al over de propertyName is gemapped return'en we
            if (propertyNamesMapped.includes(propertyName)) {
                return
            }

            // Anders voegen we de nieuwe propertyName aan de propertyNamesMapped
            propertyNamesMapped.push(propertyName)

            // !!!
            if (
                crudObject[propertyName] !== undefined &&
                crudObject[propertyName].length > 0
            ) {
                newStateKoppelingenRelatiesObject[propertyName] = []
                crudObject[propertyName].forEach((item, index) => {
                    newStateKoppelingenRelatiesObject[propertyName].push(item)
                })
            }
        })

        const that = this

        // Functie om de .data property toe te voegen aan het object
        function findPropertyAndAddDataToStateObject(propertyName, data) {
            const objectIndex = newStateKoppelingenRelatiesObject[
                propertyName
            ].findIndex((x) => x.UUID === data.UUID)

            newStateKoppelingenRelatiesObject[propertyName][
                objectIndex
            ].data = data

            // Als het het laatste item is wat geupdate wordt updaten we nog een keer de state, zodat de .data properties op alle objecten zitten en geupdate worden in de state, en dus in de UI
            that.setState({
                koppelingenRelaties: newStateKoppelingenRelatiesObject,
            })
        }

        // Map over actieveKoppelingOfRelaties -> een array met de actie koppelingen & relaties vanuit het CrudObject
        // Vervolgens mappen we hierbinnen over de koppelingen om voor elk de UUID te pakken en hierop een API call te maken
        // Deze worden gereturned in een Promise.all()
        Promise.all(
            actieveKoppelingOfRelaties.map((propertyName, indexPropertyName) =>
                newStateKoppelingenRelatiesObject[propertyName].map(
                    (koppeling, indexKoppeling) => {
                        if (
                            objecten[propertyName.toLowerCase()] === undefined
                        ) {
                            return null
                        }

                        axios
                            .get(
                                `${
                                    objecten[propertyName.toLowerCase()].api
                                }/version/${koppeling.UUID}`
                            )
                            .then((res) => {
                                findPropertyAndAddDataToStateObject(
                                    propertyName,
                                    res.data
                                )
                            })
                    }
                )
            )
        )
            .then((responses) => {
                this.setState({
                    dataFromAPILoaded: true,
                })
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.crudObject !== this.props.crudObject) {
            this.initializeComponent()
        }
    }
    componentDidMount() {
        this.initializeComponent()
    }
    render() {
        const that = this
        const verticalLayoutBool =
            this.state.koppelingenRelaties &&
            Object.keys(this.state.koppelingenRelaties).length > 4
        return (
            <div className="mt-8">
                <h2 className="block font-serif text-lg tracking-wide text-gray-700">
                    Relaties binnen de omgevingsvisie
                </h2>
                {verticalLayoutBool ? (
                    <ul
                        className={`mt-3 
                ${verticalLayoutBool ? 'flex-row' : 'flex'}`}
                    >
                        {this.state.koppelingenRelaties
                            ? Object.keys(this.state.koppelingenRelaties).map(
                                  function (key, index) {
                                      if (
                                          index === 0 &&
                                          !that.state
                                              .activeSectionInitialized &&
                                          !that.state.activeSection
                                      ) {
                                          that.setState({
                                              activeSection: key,
                                              activeSectionInitialized: true,
                                          })
                                      }
                                      return (
                                          <React.Fragment>
                                              <TabbladRelatieComponent
                                                  verticalLayoutBool={
                                                      verticalLayoutBool
                                                  }
                                                  activeSection={
                                                      that.state.activeSection
                                                  }
                                                  Titel={key}
                                                  Length={
                                                      that.state
                                                          .koppelingenRelaties[
                                                          key
                                                      ].length
                                                  }
                                                  click={() => {
                                                      that.setState({
                                                          activeSection: key,
                                                      })
                                                  }}
                                              />
                                              <TabbladInhoudRelatieComponent
                                                  verticalLayoutBool={
                                                      verticalLayoutBool
                                                  }
                                                  activeSection={
                                                      that.state.activeSection
                                                  }
                                                  array={
                                                      that.state
                                                          .koppelingenRelaties[
                                                          key
                                                      ]
                                                  }
                                                  titel={key}
                                              />
                                          </React.Fragment>
                                      )
                                  }
                              )
                            : null}
                    </ul>
                ) : (
                    <React.Fragment>
                        <ul className={`mt-3 flex`}>
                            {this.state.koppelingenRelaties
                                ? Object.keys(
                                      this.state.koppelingenRelaties
                                  ).map(function (key, index) {
                                      if (
                                          index === 0 &&
                                          !that.state
                                              .activeSectionInitialized &&
                                          !that.state.activeSection
                                      ) {
                                          that.setState({
                                              activeSection: key,
                                              activeSectionInitialized: true,
                                          })
                                      }
                                      return (
                                          <TabbladRelatieComponent
                                              verticalLayoutBool={
                                                  verticalLayoutBool
                                              }
                                              activeSection={
                                                  that.state.activeSection
                                              }
                                              Titel={key}
                                              Length={
                                                  that.state
                                                      .koppelingenRelaties[key]
                                                      .length
                                              }
                                              click={() => {
                                                  that.setState({
                                                      activeSection: key,
                                                  })
                                              }}
                                          />
                                      )
                                  })
                                : null}
                        </ul>
                        {this.state.koppelingenRelaties
                            ? Object.keys(this.state.koppelingenRelaties).map(
                                  function (key, index) {
                                      return (
                                          <TabbladInhoudRelatieComponent
                                              verticalLayoutBool={
                                                  verticalLayoutBool
                                              }
                                              activeSection={
                                                  that.state.activeSection
                                              }
                                              array={
                                                  that.state
                                                      .koppelingenRelaties[key]
                                              }
                                              titel={key}
                                          />
                                      )
                                  }
                              )
                            : null}
                    </React.Fragment>
                )}
            </div>
        )
    }
}

function TabbladRelatieComponent(props) {
    const borderStyles = props.verticalLayoutBool
        ? 'border-l-2 border-blue-600'
        : 'border-b-2 border-blue-600'
    const borderStylesActiveSection = props.verticalLayoutBool
        ? 'border-l-2 border-white'
        : 'border-b-2 border-white'

    return (
        <li
            onClick={props.click}
            className={`py-2 pl-2 mb-2 pr-6 cursor-pointer ${
                props.activeSection === props.Titel
                    ? borderStyles
                    : borderStylesActiveSection
            }`}
        >
            <span className="block text-lg font-bold text-gray-700">
                {props.Titel.charAt(0).toUpperCase() + props.Titel.substring(1)}
            </span>
            <span className="block text-sm text-gray-600">
                {props.Length} gekoppeld
            </span>
        </li>
    )
}

function TabbladInhoudRelatieComponent(props) {
    if (props.activeSection === props.titel) {
        return (
            <ul className={`${props.activeSection ? 'mb-3' : ''}`}>
                {props.array.map((relatie) => {
                    return (
                        <li className="relative py-2 pl-2 pr-6 border-b border-gray-300 hover:underline">
                            <Link
                                to={`/detail/${props.titel.toLowerCase()}/${
                                    relatie.data ? relatie.data.ID : '0'
                                }`}
                                to={
                                    relatie.data
                                        ? `/detail/${props.titel.toLowerCase()}/${
                                              relatie.data.ID
                                          }`
                                        : '#'
                                }
                            >
                                <span className="block text-gray-700">
                                    {relatie.data ? (
                                        relatie.data.Titel
                                    ) : (
                                        <LoaderSmallSpan />
                                    )}
                                </span>
                                <FontAwesomeIcon
                                    className="absolute top-0 right-0 mt-3 mr-2 text-gray-600"
                                    icon={faAngleRight}
                                />
                            </Link>
                        </li>
                    )
                })}
            </ul>
        )
    } else {
        return null
    }
}

const objecten = {
    belangen: {
        buttonTekst: 'belang',
        volledigeTitel: 'Nationaal Belang',
        volledigeTitelMeervoud: 'Nationale Belangen',
        api: '/belangen',
        filterAPI: true,
        filterType: 'Nationaal Belang',
        propertyName: 'Belangen',
        type: 'Nationaal Belang',
    },
    taken: {
        buttonTekst: 'taak',
        volledigeTitel: 'Wettelijke taken & bevoegdheden',
        volledigeTitelMeervoud: 'Wettelijke taken & bevoegdheden',
        api: '/belangen',
        filterAPI: true,
        filterType: 'Wettelijke Taak & Bevoegdheid',
        propertyName: 'Belangen',
        type: 'Wettelijke Taak & Bevoegdheid',
    },
    ambities: {
        buttonTekst: 'ambities',
        volledigeTitel: 'Ambities',
        volledigeTitelMeervoud: 'Ambities',
        api: '/ambities',
        propertyName: 'Ambities',
        type: 'Ambitie',
    },
    opgaven: {
        buttonTekst: 'opgaven',
        volledigeTitel: 'Opgaven',
        volledigeTitelMeervoud: 'Opgaven',
        api: '/opgaven',
        propertyName: 'Opgaven',
        type: 'Opgave',
    },
    themas: {
        buttonTekst: 'themas',
        volledigeTitel: 'Themas',
        volledigeTitelMeervoud: 'Themas',
        api: '/themas',
        propertyName: 'Themas',
        type: 'Thema',
    },
    doelen: {
        buttonTekst: 'doelen',
        volledigeTitel: 'Doelen',
        volledigeTitelMeervoud: 'Doelen',
        api: '/doelen',
        propertyName: 'Doelen',
        type: 'Doel',
    },
    maatregelen: {
        buttonTekst: 'maatregelen',
        volledigeTitel: 'Maatregelen',
        volledigeTitelMeervoud: 'Maatregelen',
        api: '/maatregelen',
        propertyName: 'Maatregelen',
        type: 'Maatregel',
    },
    verordening: {
        buttonTekst: 'verordeningen',
        volledigeTitel: 'Verordening',
        volledigeTitelMeervoud: 'Verordeningen',
        api: '/verordeningen',
        propertyName: 'Verordening',
        type: 'Verordening',
    },
    beleidsregels: {
        buttonTekst: 'beleidsregels',
        volledigeTitel: 'Beleidsregels',
        volledigeTitelMeervoud: 'Beleidsregels',
        api: '/beleidsregels',
        propertyName: 'BeleidsRegels',
        type: 'Beleidsregel',
    },
}

export default RelatieKoppelingenComponent
