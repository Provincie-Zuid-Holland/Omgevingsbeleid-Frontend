import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import LoaderSmallSpan from './../../../components/LoaderSmallSpan'

import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Axios instance to connect with the API
import axios from '../../../API/axios'

class RelatieComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            koppelingenRelaties: [],
        }
        this.initializeComponent = this.initializeComponent.bind(this)
        this.getBeleidsrelaties = this.getBeleidsrelaties.bind(this)
        this.popExtFieldAndSetState = this.popExtFieldAndSetState.bind(this)
        this.genKoppelingenRelatiesObject = this.genKoppelingenRelatiesObject.bind(
            this
        )
        this.populizeDataPropertyAndSetState = this.populizeDataPropertyAndSetState.bind(
            this
        )
    }

    getBeleidsrelaties(vanuitEndpoint, cb) {
        // Parameter 'vanuitEndpoint' is altijd een string met of de waarde 'Naar' of 'Van'
        // Parameter 'cb' is de Callback voor de verkregen data vauit de Promise
        const UUID = this.props.crudObject.UUID
        axios
            .get(`/beleidsrelaties?${vanuitEndpoint}_Beleidsbeslissing=${UUID}`)
            .then(res => {
                if (res.data.length === 0) return
                let beleidsrelaties = res.data.filter(
                    item => item.Status === 'Akkoord'
                )
                console.log(beleidsrelaties)

                cb(beleidsrelaties)
            })
            .catch(err => console.log(err))
    }

    popExtFieldAndSetState(beleidsrelaties) {
        // In de bovenstaande request krijgen we enkel de velden van de relatie, maar we willen ook de titel naar de externe relatie tonen, hiervoor moeten we voor elk van de relaties een request doen om deze informatie te krijgen.
        // De response wordt vervolgens op het relatie object onder de property .data geplaatst
        const axiosGETArray = beleidsrelaties.map(relatie => {
            return axios
                .get(
                    `/beleidsbeslissingen/version/${relatie.Naar_Beleidsbeslissing}`
                )
                .then(response => {
                    relatie.data = response.data
                })
        })

        const that = this

        Promise.all(axiosGETArray).then(function(values) {
            let newObject = that.state.koppelingenRelaties
            if (
                newObject.beleidsbeslissingen &&
                newObject.beleidsbeslissingen.length > 0
            ) {
                newObject.beleidsbeslissingen.concat(beleidsrelaties)
            } else {
                newObject.beleidsbeslissingen = beleidsrelaties
            }
            that.setState({
                koppelingenRelaties: newObject,
            })
        })
    }

    getActieveKoppelingenRelaties() {
        const crudObject = this.props.crudObject
        // Een lijst met alle mogelijke koppeling / relatie property namen
        const koppelingRelatieArray = [
            'ambities',
            'opgaven',
            'themas',
            'beleidsregels',
            'doelen',
            'maatregelen',
            'verordening',
        ]

        // Voor elk item in de koppelingRelatieArray kijken we of deze al een actieve koppeling heeft op het gekregen crudObject
        return koppelingRelatieArray
            .filter(item => {
                const propertyName = objecten[item].propertyName
                return (
                    crudObject[propertyName] !== undefined &&
                    crudObject[propertyName] !== null &&
                    crudObject[propertyName].length > 0
                )
            })
            .map(item => objecten[item].propertyName)
    }

    genKoppelingenRelatiesObject(actieveKoppelingOfRelaties) {
        const crudObject = this.props.crudObject
        let propertyNamesMapped = []
        let newStateKoppelingenRelatiesObject = {}
        actieveKoppelingOfRelaties.forEach(propertyName => {
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
        return newStateKoppelingenRelatiesObject
    }

    populizeDataPropertyAndSetState(
        propertyName,
        data,
        newStateKoppelingenRelatiesObject
    ) {
        const objectIndex = newStateKoppelingenRelatiesObject[
            propertyName
        ].findIndex(x => x.UUID === data.UUID)

        newStateKoppelingenRelatiesObject[propertyName][objectIndex].data = data

        this.setState({
            koppelingenRelaties: newStateKoppelingenRelatiesObject,
        })
    }

    initializeComponent() {
        this.getBeleidsrelaties('Van', this.popExtFieldAndSetState)
        this.getBeleidsrelaties('Naar', this.popExtFieldAndSetState)

        // ***
        // Haal alle koppelingen en relaties op
        let actieveKoppelingOfRelaties = this.getActieveKoppelingenRelaties()

        // Het object waar de nieuwe koppeling en relatie state in gemaakt wordt
        let newStateKoppelingenRelatiesObject = this.genKoppelingenRelatiesObject(
            actieveKoppelingOfRelaties
        )

        // Map over actieveKoppelingOfRelaties -> een array met de actie koppelingen & relaties vanuit het CrudObject
        // Vervolgens mappen we hierbinnen over de koppelingen om voor elk de UUID te pakken en hierop een API call te maken
        // Deze worden gereturned in een Promise.all()
        Promise.all(
            actieveKoppelingOfRelaties.map((propertyName, indexPropertyName) =>
                newStateKoppelingenRelatiesObject[propertyName]
                    .filter(
                        item =>
                            objecten[propertyName.toLowerCase()] !== undefined
                    )
                    .forEach((koppeling, indexKoppeling) => {
                        axios
                            .get(
                                `${
                                    objecten[propertyName.toLowerCase()].api
                                }/version/${koppeling.UUID}`
                            )
                            .then(res => {
                                this.populizeDataPropertyAndSetState(
                                    propertyName,
                                    res.data,
                                    newStateKoppelingenRelatiesObject
                                )
                            })
                    })
            )
        )
            .then(responses => {
                this.setState({
                    dataFromAPILoaded: true,
                })
            })
            .catch(err => console.log(err))
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
                <h2 className="block tracking-wide text-gray-700 text-lg font-serif">
                    Relaties binnen de omgevingsvisie
                </h2>
                {verticalLayoutBool ? (
                    <ul
                        className={`mt-3 
                ${verticalLayoutBool ? 'flex-row' : 'flex'}`}
                    >
                        {this.state.koppelingenRelaties
                            ? Object.keys(this.state.koppelingenRelaties).map(
                                  function(key, index) {
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
                                  ).map(function(key, index) {
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
                                              key={key}
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
                                  function(key, index) {
                                      return (
                                          <TabbladInhoudRelatieComponent
                                              key={key}
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
            <span className="text-gray-700 font-bold text-lg block">
                {props.Titel.charAt(0).toUpperCase() + props.Titel.substring(1)}
            </span>
            <span className="text-gray-600 text-sm block">
                {props.Length} gekoppeld
            </span>
        </li>
    )
}

function TabbladInhoudRelatieComponent(props) {
    if (props.activeSection === props.titel) {
        return (
            <ul className={`${props.activeSection ? 'mb-3' : ''}`}>
                {props.array.map((relatie, index) => {
                    return (
                        <li
                            key={relatie.data ? relatie.data.ID : index}
                            className="py-2 pl-2 pr-6 border-b border-gray-300 hover:underline relative"
                        >
                            <Link
                                to={
                                    relatie.data
                                        ? `/detail/${props.titel.toLowerCase()}/${
                                              relatie.data.ID
                                          }`
                                        : '#'
                                }
                            >
                                <span className="text-gray-700 block">
                                    {relatie.data ? (
                                        relatie.data.Titel
                                    ) : (
                                        <LoaderSmallSpan />
                                    )}
                                </span>
                                <FontAwesomeIcon
                                    className="absolute right-0 top-0 mt-3 mr-2  text-gray-600"
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
        propertyName: 'Beleidsregels',
        type: 'Beleidsregel',
    },
}

export default RelatieComponent
