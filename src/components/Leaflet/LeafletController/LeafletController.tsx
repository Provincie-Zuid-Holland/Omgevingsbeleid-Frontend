import { useLeafletContext } from '@react-leaflet/core'
import { Control, DomUtil, DomEvent, Map } from 'leaflet'
import cloneDeep from 'lodash.clonedeep'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { LayersControlProps } from 'react-leaflet'

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

    onAdd() {
        const _controlDiv = DomUtil.create('div', this.options.className)
        DomEvent.disableClickPropagation(_controlDiv)
        return _controlDiv
    },

    onRemove(map: Map) {
        if (this.options.onOff) {
            map.off(this.options.onOff, this.options.handleOff, this)
        }

        return this
    },
})

const createLeafletElement = (props: LayersControlProps) => {
    return new DumbControl(cloneDeep(props))
}

function LeafletController(props: LayersControlProps) {
    const [controlContainer, setControlContainer] = useState<
        HTMLElement | undefined
    >(undefined)
    const context = useLeafletContext()
    const container = (context.layerContainer || context.map) as Map

    useEffect(() => {
        const control = createLeafletElement(props)
        container.addControl(control)

        setControlContainer(control.getContainer())

        return () => {
            container.removeControl(control)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!controlContainer || !props.children) {
        return null
    }

    return createPortal(props.children, controlContainer)
}

export default LeafletController
