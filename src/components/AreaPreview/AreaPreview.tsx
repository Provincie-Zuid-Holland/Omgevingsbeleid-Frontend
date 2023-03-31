import { Text } from '@pzh-ui/components'
import classNames from 'classnames'
import { useState } from 'react'
import { useUpdateEffect } from 'react-use'

import { Werkingsgebied } from '@/api/fetchers.schemas'

import { LoaderSpinner } from '../Loader'

interface AreaPreviewProps {
    area?: Werkingsgebied
}

const getAreaImage = (uuid: string) =>
    `https://geo-omgevingsbeleid-test.azurewebsites.net/wms/reflect?format=image/png&layers=OMGEVINGSBELEID:Werkingsgebieden_brt&srs=EPSG:28992&width=500&bbox=43662.62,406692,140586.08,483120&cql_filter=UUID IN ('${uuid}')`

const AreaPreview = ({ area }: AreaPreviewProps) => {
    const [areaLoaded, setAreadLoaded] = useState(false)

    useUpdateEffect(() => setAreadLoaded(false), [area?.UUID])

    return (
        <div className="relative z-0 w-full flex items-center justify-center overflow-hidden text-center rounded-[4px] bg-pzh-gray-100">
            {!area ? (
                <Text className="text-pzh-gray-600">
                    Selecteer een werkingsgebied
                    <br />
                    om de laatste versie te bekijken
                </Text>
            ) : (
                <>
                    <img
                        src={getAreaImage(area.UUID)}
                        alt={area.Title}
                        className={classNames('w-full h-full object-cover', {
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
