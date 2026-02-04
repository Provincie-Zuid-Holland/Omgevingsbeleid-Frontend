import 'leaflet'

declare module 'leaflet' {
    interface WMSOptions {
        cql_filter?: string
        tiled?: boolean
    }

    namespace TileLayer {
        interface WMSParams {
            cql_filter?: string
        }
    }
}
