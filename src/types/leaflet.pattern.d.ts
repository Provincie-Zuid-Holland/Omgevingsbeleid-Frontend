import * as L from 'leaflet'

declare module 'leaflet' {
    interface StripePatternOptions {
        weight?: number
        spaceWeight?: number
        color?: string
        spaceColor?: string
        opacity?: number
        spaceOpacity?: number
        angle?: number
    }

    class StripePattern extends L.Path {
        constructor(options?: StripePatternOptions)
        addTo(map: L.Map): this
    }
}

// this makes `import 'leaflet.pattern'` type-safe
declare module 'leaflet.pattern' {
    // side-effect only
    export {}
}
