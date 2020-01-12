import { PropTypes } from 'prop-types'
import Draw from 'leaflet-draw'
import isEqual from 'lodash.isequal'
import './../../../node_modules/leaflet-draw/dist/leaflet.draw-src.css'
import { MapControl, withLeaflet } from 'react-leaflet'
import leaflet, { Map, Control } from 'leaflet'

const eventHandlers = {
    onEdited: 'draw:edited',
    onDrawStart: 'draw:drawstart',
    onDrawStop: 'draw:drawstop',
    onDrawVertex: 'draw:drawvertex',
    onEditStart: 'draw:editstart',
    onEditMove: 'draw:editmove',
    onEditResize: 'draw:editresize',
    onEditVertex: 'draw:editvertex',
    onEditStop: 'draw:editstop',
    onDeleted: 'draw:deleted',
    onDeleteStart: 'draw:deletestart',
    onDeleteStop: 'draw:deletestop',
}

class EditControl extends MapControl {
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
            'topright',
            'topleft',
            'bottomright',
            'bottomleft',
        ]),
        leaflet: PropTypes.shape({
            map: PropTypes.instanceOf(Map),
            layerContainer: PropTypes.shape({
                addLayer: PropTypes.func.isRequired,
                removeLayer: PropTypes.func.isRequired,
            }),
        }),
    }

    createLeafletElement(props) {
        return createDrawElement(props)
    }

    onDrawCreate = e => {
        const { onCreated } = this.props
        const { layerContainer } = this.props.leaflet

        console.log(e)
        this.setState(
            {
                currentLayerType: e.layerType,
            },
            () => console.log(this.state)
        )

        // Remove all markers before adding new ones
        layerContainer.clearLayers()
        console.log(layerContainer)

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

        const polygonEl = document.getElementsByClassName(
            'leaflet-draw-draw-polygon'
        )
        polygonEl[0].innerHTML =
            '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="draw-polygon" class="svg-inline--fa fa-draw-polygon fa-w-14 text-xl inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M384 352c-.35 0-.67.1-1.02.1l-39.2-65.32c5.07-9.17 8.22-19.56 8.22-30.78s-3.14-21.61-8.22-30.78l39.2-65.32c.35.01.67.1 1.02.1 35.35 0 64-28.65 64-64s-28.65-64-64-64c-23.63 0-44.04 12.95-55.12 32H119.12C108.04 44.95 87.63 32 64 32 28.65 32 0 60.65 0 96c0 23.63 12.95 44.04 32 55.12v209.75C12.95 371.96 0 392.37 0 416c0 35.35 28.65 64 64 64 23.63 0 44.04-12.95 55.12-32h209.75c11.09 19.05 31.49 32 55.12 32 35.35 0 64-28.65 64-64 .01-35.35-28.64-64-63.99-64zm-288 8.88V151.12A63.825 63.825 0 0 0 119.12 128h208.36l-38.46 64.1c-.35-.01-.67-.1-1.02-.1-35.35 0-64 28.65-64 64s28.65 64 64 64c.35 0 .67-.1 1.02-.1l38.46 64.1H119.12A63.748 63.748 0 0 0 96 360.88zM272 256c0-8.82 7.18-16 16-16s16 7.18 16 16-7.18 16-16 16-16-7.18-16-16zM400 96c0 8.82-7.18 16-16 16s-16-7.18-16-16 7.18-16 16-16 16 7.18 16 16zM64 80c8.82 0 16 7.18 16 16s-7.18 16-16 16-16-7.18-16-16 7.18-16 16-16zM48 416c0-8.82 7.18-16 16-16s16 7.18 16 16-7.18 16-16 16-16-7.18-16-16zm336 16c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"></path></svg>'

        const markerEl = document.getElementsByClassName(
            'leaflet-draw-draw-marker'
        )
        markerEl[0].innerHTML =
            '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" class="svg-inline--fa fa-map-marker-alt fa-w-12 text-xl inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>'

        const editEl = document.getElementsByClassName('leaflet-draw-edit-edit')
        editEl[0].innerHTML =
            '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18 text-xl inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"></path></svg>'

        const thrashEl = document.getElementsByClassName(
            'leaflet-draw-edit-remove'
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
        if (this.state.currentLayerType === 'marker') {
            const editEl = document.getElementsByClassName(
                'leaflet-draw-edit-edit'
            )
            editEl[0].classList.add('hide-leaflet-edit')
        } else {
            const editEl = document.getElementsByClassName(
                'leaflet-draw-edit-edit'
            )
            editEl[0].classList.remove('hide-leaflet-edit')
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
        this.leafletElement.addTo(map).on('click', () => {
            // console.log('Clicked')
        })

        return null
    }
}

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

    return new Control.Draw(options)
}

export default withLeaflet(EditControl)
