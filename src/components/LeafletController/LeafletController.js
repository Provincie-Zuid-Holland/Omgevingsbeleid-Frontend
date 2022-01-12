import { Control, DomUtil, DomEvent } from 'leaflet'
import cloneDeep from 'lodash.clonedeep'
import ReactDOM from 'react-dom'
import { MapControl, withLeaflet } from 'react-leaflet'

/**
 * Object that uses the Control.extend function containing the options variable, _controlDiv (returned by the onAdd function) and the map when the onRemove function is used.
 *
 * @object
 */
const DumbControl = Control.extend({
    options: {
        className: '',
        onOff: '',
        handleOff: function noop() {},
    },

    onAdd(/* map */) {
        var _controlDiv = DomUtil.create('div', this.options.className)
        DomEvent.disableClickPropagation(_controlDiv)
        return _controlDiv
    },

    onRemove(map) {
        if (this.options.onOff) {
            map.off(this.options.onOff, this.options.handleOff, this)
        }

        return this
    },
})

export default withLeaflet(
    /**
     * Class that renders the LeafletControl component that contains the leafletElements.
     *
     * @class
     * @extends MapControl
     */
    class LeafletControl extends MapControl {
        /**
         * Function that returns a new object based on the DumbControl object while using the imported cloneDeep function from lodash.clonedeep with the props value.
         *
         *
         *
         * @param {object} props - parameter containing a collection of data which is passed down from the parent and used within the cloneDeep function.
         */
        createLeafletElement(props) {
            return new DumbControl(cloneDeep(props))
        }

        componentDidMount() {
            super.componentDidMount()

            // This is needed because the control is only attached to the map in
            // MapControl's componentDidMount, so the container is not available
            // until this is called. We need to now force a render so that the
            // portal and children are actually rendered.
            this.forceUpdate()
        }

        render() {
            if (!this.leafletElement || !this.leafletElement.getContainer()) {
                return null
            }
            return ReactDOM.createPortal(
                this.props.children,
                this.leafletElement.getContainer()
            )
        }
    }
)
