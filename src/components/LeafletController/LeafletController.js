import ReactDOM from 'react-dom'
import { MapControl, withLeaflet } from 'react-leaflet'
import { Control, DomUtil, DomEvent } from 'leaflet'
import cloneDeep from 'lodash.clonedeep'

/**
 * Function to extend the controller.
 *
 * @function
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
     * Class that renders the LeafletControl.
     *
     * @class
     * @extends MapControl
     */
    class LeafletControl extends MapControl {
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
