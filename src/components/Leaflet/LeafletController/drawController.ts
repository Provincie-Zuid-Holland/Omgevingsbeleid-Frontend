import {
    useLeafletContext,
    createElementHook,
    createLeafComponent,
} from '@react-leaflet/core'
import leaflet, { Control } from 'leaflet'
import { useCallback, useEffect, useRef } from 'react'

export const createControlComponent = (createInstance: any) => {
    function createElement(
        props: Control.DrawConstructorOptions,
        context: any
    ) {
        const { layerContainer } = context
        const { position } = props
        const options = {
            position,
            edit: {
                featureGroup: layerContainer,
            },
        }

        return { instance: createInstance(options), context }
    }
    const useElement = createElementHook(createElement)
    const useControl = createControlHook(useElement)
    return createLeafComponent(useControl)
}

const createControlHook = (useElement: any) => {
    return function useLeafletControl(props: any) {
        const context = useLeafletContext()
        const elementRef = useElement(props, context)
        const { instance } = elementRef.current
        const positionRef = useRef(props.position)
        const { position, onCreated, onEdit, onDeleted } = props

        const onDrawCreate = useCallback(
            e => {
                context.layerContainer?.addLayer(e.layer)
                onCreated(e)
            },
            [context.layerContainer, onCreated]
        )

        useEffect(
            function addControl() {
                instance.addTo(context.map)
                context.map.on(leaflet.Draw.Event.CREATED, onDrawCreate)

                if (onDeleted) {
                    context.map.on(leaflet.Draw.Event.DELETED, onDeleted)
                }

                if (onEdit) {
                    context.map.on(leaflet.Draw.Event.EDITRESIZE, onEdit)
                    context.map.on(leaflet.Draw.Event.EDITMOVE, onEdit)
                }

                return function removeControl() {
                    context.map.off(leaflet.Draw.Event.CREATED, onDrawCreate)

                    if (onDeleted) {
                        context.map.off(leaflet.Draw.Event.DELETED, onDeleted)
                    }

                    if (onEdit) {
                        context.map.off(leaflet.Draw.Event.EDITRESIZE, onEdit)
                        context.map.off(leaflet.Draw.Event.EDITMOVE, onEdit)
                    }

                    instance.remove()
                }
            },
            [context.map, instance, onDrawCreate, onDeleted, onEdit]
        )

        useEffect(
            function updateControl() {
                if (position != null && position !== positionRef.current) {
                    instance.setPosition(position)
                    positionRef.current = position
                }
            },
            [instance, position]
        )

        return elementRef
    }
}