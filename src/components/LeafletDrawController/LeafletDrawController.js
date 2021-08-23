import { PropTypes } from "prop-types"

// We need this import to make the draw function work
// eslint-disable-next-line
import Draw from "leaflet-draw"

import isEqual from "lodash.isequal"
import "./../../../node_modules/leaflet-draw/dist/leaflet.draw-src.css"
import { MapControl, withLeaflet } from "react-leaflet"
import leaflet, { Map, Control } from "leaflet"

const eventHandlers = {
    onEdited: "draw:edited",
    onDrawStart: "draw:drawstart",
    onDrawStop: "draw:drawstop",
    onDrawVertex: "draw:drawvertex",
    onEditStart: "draw:editstart",
    onEditMove: "draw:editmove",
    onEditResize: "draw:editresize",
    onEditVertex: "draw:editvertex",
    onEditStop: "draw:editstop",
    onDeleted: "draw:deleted",
    onDeleteStart: "draw:deletestart",
    onDeleteStop: "draw:deletestop",
}

/**
 * Class that contains a collection of functions used within the Leaflet component.
 *
 */
class LeafletDrawController extends MapControl {
    constructor(props) {
        super(props)
        this.state = {
            currentLayerType: null,
        }
        this.onDrawCreate = this.onDrawCreate.bind(this)
    }

    static propTypes = {
        ...Object.keys(eventHandlers).reduce((acc, val) => {
            acc[val] = PropTypes.func
            return acc
        }, {}),
        onCreated: PropTypes.func,
        onMounted: PropTypes.func,
        draw: PropTypes.shape({
            polyline: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
            polygon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
            rectangle: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
            circle: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
            marker: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        }),
        edit: PropTypes.shape({
            edit: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
            remove: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
            poly: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
            allowIntersection: PropTypes.bool,
        }),
        position: PropTypes.oneOf([
            "topright",
            "topleft",
            "bottomright",
            "bottomleft",
        ]),
        leaflet: PropTypes.shape({
            map: PropTypes.instanceOf(Map),
            layerContainer: PropTypes.shape({
                addLayer: PropTypes.func.isRequired,
                removeLayer: PropTypes.func.isRequired,
            }),
        }),
    }

    /**
     * Function that uses the createDrawElement function with the passed down props value.
     *
     *
     *
     * @param {object} props - Parameter that contains a collection of data which is passed down from the parent and used in the createDrawElement function.
     */
    createLeafletElement(props) {
        return createDrawElement(props)
    }

    /**
     * Function to set the state of the currentLayerType and to set the onCreated and layerContainer variables.
     *
     *
     *
     * @param {e} e - Parameter that contains the layerType value which is used to set the value of the currentLayerType state.
     */
    onDrawCreate = (e) => {
        const { onCreated } = this.props
        const { layerContainer } = this.props.leaflet

        this.setState({
            currentLayerType: e.layerType,
        })

        // Remove all markers before adding new ones
        layerContainer.clearLayers()

        layerContainer.addLayer(e.layer)
        onCreated && onCreated(e)
    }

    componentDidMount() {
        super.componentDidMount()
        const { map } = this.props.leaflet
        const { onMounted } = this.props

        for (const key in eventHandlers) {
            if (this.props[key]) {
                map.on(eventHandlers[key], this.props[key])
            }
        }

        map.on(leaflet.Draw.Event.CREATED, this.onDrawCreate)

        onMounted && onMounted(this.leafletElement)

        const markerEl = document.getElementsByClassName(
            "leaflet-draw-draw-marker"
        )
        markerEl[0].innerHTML =
            '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" class="svg-inline--fa fa-map-marker-alt fa-w-12 text-xl inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>'

        const editEl = document.getElementsByClassName("leaflet-draw-edit-edit")
        editEl[0].innerHTML =
            '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18 text-xl inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"></path></svg>'

        const thrashEl = document.getElementsByClassName(
            "leaflet-draw-edit-remove"
        )
        thrashEl[0].innerHTML =
            '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14 text-xl inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg>'
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        const { map } = this.props.leaflet

        map.off(leaflet.Draw.Event.CREATED, this.onDrawCreate)

        for (const key in eventHandlers) {
            if (this.props[key]) {
                map.off(eventHandlers[key], this.props[key])
            }
        }
    }

    componentDidUpdate(prevProps) {
        // super updates positions if thats all that changed so call this first
        super.componentDidUpdate(prevProps)

        // If the current element is a marker, we hide the 'edit' icon
        if (this.state.currentLayerType === "marker") {
            const editEl = document.getElementsByClassName(
                "leaflet-draw-edit-edit"
            )
            editEl[0].classList.add("hide-leaflet-edit")
        } else {
            const editEl = document.getElementsByClassName(
                "leaflet-draw-edit-edit"
            )
            editEl[0].classList.remove("hide-leaflet-edit")
        }

        if (
            isEqual(this.props.draw, prevProps.draw) ||
            this.props.position !== prevProps.position
        ) {
            return false
        }

        const { map } = this.props.leaflet

        this.leafletElement.remove(map)
        this.leafletElement = createDrawElement(this.props)

        return null
    }
}

/**
 * Function that creates a Draw element based on the props given and uses this to set the value to layerContainer, draw, edit, position variables
 * which are used in the leaflet.drawLocal and eventually the function returns a newDraw object.
 *
 * @param {object} props - Parameter that contains a collection of data that is used within the function to set the values of layerContainer, draw, edit and position variables.
 */
function createDrawElement(props) {
    const { layerContainer } = props.leaflet
    const { draw, edit, position } = props
    const options = {
        edit: {
            ...edit,
            featureGroup: layerContainer,
        },
    }

    if (draw) {
        options.draw = { ...draw }
    }

    if (position) {
        options.position = position
    }

    const newDraw = new Control.Draw(options)

    leaflet.drawLocal = {
        draw: {
            toolbar: {
                // #TODO: this should be reorganized where actions are nested in actions
                // ex: actions.undo  or actions.cancel
                actions: {
                    title: "Annuleren",
                    text: "Klik op de kaart om de marker te plaatsen",
                },
                finish: {
                    title: "Klik op de kaart om de marker te plaatsen",
                    text: "Klik op de kaart om de marker te plaatsen",
                },
                undo: {
                    title: "Ongedaan maken",
                    text: "Ongedaan maken",
                },
                buttons: {
                    polyline: "",
                    polygon: "",
                    rectangle: "",
                    circle: "",
                    marker: "Klik op de kaart om de marker te plaatsen",
                    circlemarker: "",
                },
            },
            handlers: {
                circle: {
                    tooltip: {
                        start: "",
                    },
                    radius: "",
                },
                circlemarker: {
                    tooltip: {
                        start: "",
                    },
                },
                marker: {
                    tooltip: {},
                },
                polygon: {
                    tooltip: {
                        start: "",
                        cont: "",
                        end: "",
                    },
                },
                polyline: {
                    error:
                        "<strong>Error:</strong> Vorm grenzen mogen elkaar niet kruizen",
                    tooltip: {
                        start: "Klik om te beginnen met uw lijn",
                        cont: "Klik om uw lijn voort te zetten",
                        end: "Klik om uw lijn af te maken",
                    },
                },
                rectangle: {
                    tooltip: {
                        start: "",
                    },
                },
                simpleshape: {
                    tooltip: {
                        end: "Laat uw muis los om uw vorm af te maken",
                    },
                },
            },
        },
        edit: {
            toolbar: {
                actions: {
                    save: {
                        title: "Wijzigingen opslaan",
                        text: "Opslaan",
                    },
                    cancel: {
                        title: "Annuleer wijzigingen",
                        text: "Annuleren",
                    },
                    clearAll: {
                        title: "Verwijder alle lagen",
                        text: "Verwijder alles",
                    },
                },
                buttons: {
                    edit: "Wijzig de lagen",
                    editDisabled: "Er zijn geen lagen om te wijzigen",
                    remove: "Verwijder lagen",
                    removeDisabled: "Er zijn geen lagen om te wijzigen",
                },
            },
            handlers: {
                edit: {
                    tooltip: {
                        text:
                            "Sleep een marker om hiervan de positie te wijzigen",
                        subtext:
                            "Klik op annuleren om de wijzigingen ongedaan te maken",
                    },
                },
                remove: {
                    tooltip: {
                        text: "Click op een marker om deze te verwijderen",
                    },
                },
            },
        },
    }

    return newDraw
}

export default withLeaflet(LeafletDrawController)
