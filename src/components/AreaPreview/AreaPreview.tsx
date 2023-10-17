import { useUpdateEffect } from '@react-hookz/web'
import classNames from 'classnames'
import { useCallback, useState } from 'react'

import { Text } from '@pzh-ui/components'

import { Werkingsgebied } from '@/api/fetchers.schemas'

import { LoaderSpinner } from '../Loader'

interface AreaPreviewProps {
    area?: Partial<Werkingsgebied>
}

const AreaPreview = ({ area }: AreaPreviewProps) => {
    const [areaLoaded, setAreadLoaded] = useState(false)

    const getAreaImage = useCallback(() => {
        const baseUrl = `${import.meta.env.VITE_GEOSERVER_API_URL}/wms/reflect`

        const params: Record<string, string | number> = {
            format: 'image/png',
            layers: `OMGEVINGSBELEID:Werkingsgebieden_brt`,
            srs: 'EPSG:28992',
            width: '500',
            bbox: '43662.62,406692,140586.08,483120',
            cql_filter: `UUID IN='${area?.UUID}'`,
        }

        const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&')

        return `${baseUrl}?${queryString}`
    }, [area?.UUID])

    useUpdateEffect(() => setAreadLoaded(false), [area?.UUID])

    return (
        <div className="relative z-0 flex w-full items-center justify-center overflow-hidden rounded bg-pzh-gray-100 text-center">
            {!area ? (
                <Text className="text-pzh-gray-600">
                    Selecteer een werkingsgebied
                    <br />
                    om de laatste versie te bekijken
                </Text>
            ) : (
                <>
                    <img
                        src={getAreaImage()}
                        alt={area.Title}
                        className={classNames('h-full w-full object-cover', {
                            hidden: !areaLoaded,
                        })}
                        onLoad={() => setAreadLoaded(true)}
                    />
                    <LoaderSpinner className="absolute left-0 right-0 -z-1 mx-auto" />
                </>
            )}
        </div>
    )
}

export default AreaPreview
