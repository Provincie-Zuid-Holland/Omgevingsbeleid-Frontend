import { Heading } from '@pzh-ui/components'
import { FC, useState } from 'react'

import { Beleidskeuze, Maatregel, Verordening } from '@/api/fetchers.schemas'
import ViewFieldIngelogdExtraInfo from '@/components/ViewFieldIngelogdExtraInfo'
import useAuth from '@/hooks/useAuth'

import RaadpleegObjectDetailNewVersionNotification from '../RaadpleegObjectDetailNewVersionNotification'
import ViewFieldGebiedDuiding from '../ViewFieldGebiedDuiding'
import ViewFieldInnerHTML from '../ViewFieldInnerHTML'
import ViewFieldTitelEnInhoud from '../ViewFieldTitelEnInhoud'
import Werkingsgebied from '../Werkingsgebied'

interface RaadpleegObjectDetailMainProps {
    dataLoaded: boolean
    dataObject: (Maatregel & Beleidskeuze & Verordening) | null
    titleSingular: string
}

const RaadpleegObjectDetailMain: FC<RaadpleegObjectDetailMainProps> = ({
    dataLoaded,
    dataObject,
    titleSingular,
    children,
}) => {
    const { user } = useAuth()

    // Boolean to toggle the large view
    const [fullscreenLeafletViewer, setFullscreenLeafletViewer] =
        useState(false)

    const getWerkingsgbiedUUID = () => {
        if (dataObject?.Gebied) {
            // Object is a maatregel, which contains the UUID in a string value
            return dataObject.Gebied.UUID
        } else if (dataObject?.Werkingsgebieden?.[0]) {
            // Object is a beleidskeuze/beleidskeuze, which holds the werkingsgebieden in an array.
            // We always need the first value in the array
            return dataObject.Werkingsgebieden[0].Object?.UUID
        }
    }

    const werkingsGebiedUUID = getWerkingsgbiedUUID()
    const showExtraInfo =
        !!user && ['Beleidskeuze', 'Maatregel'].includes(titleSingular)
    const htmlFields = [
        {
            title: undefined,
            value: 'Toelichting',
        },
        {
            title: 'Wat wil de provincie bereiken?',
            value: 'Omschrijving_Keuze',
        },
        {
            title: 'Afweging',
            value: 'Afweging',
        },
        {
            title: 'Aanleiding',
            value: 'Aanleiding',
        },
        {
            title: 'Provinciaal Belang',
            value: 'Provinciaal_Belang',
        },
        {
            title: 'Toelichting',
            value: 'Omschrijving_Werking',
        },
    ]

    return (
        <div className="col-span-6 mt-6 xl:mt-8 xl:col-span-4">
            <div className="hidden xl:block">
                <Heading
                    level="3"
                    className="font-bold"
                    color="text-pzh-blue-dark">
                    {titleSingular}
                </Heading>
                <RaadpleegObjectDetailNewVersionNotification
                    titleSingular={titleSingular}
                    dataObject={dataObject}
                />
                {dataObject && (
                    <Heading level="1" color="text-pzh-blue" className="mt-4">
                        {dataObject.Titel}
                    </Heading>
                )}
            </div>
            <div className="hidden xl:block">{children}</div>

            <div className="mt-4">
                {showExtraInfo && (
                    <ViewFieldIngelogdExtraInfo
                        className="mb-5"
                        crudObject={dataObject}
                    />
                )}

                {dataObject?.Omschrijving && (
                    <ViewFieldTitelEnInhoud
                        fieldValue={dataObject['Omschrijving']}
                    />
                )}

                {htmlFields.map(({ value, title }) => {
                    const html = dataObject?.[value as keyof typeof dataObject]

                    if (html && typeof html === 'string')
                        return (
                            <ViewFieldInnerHTML
                                key={value}
                                html={html}
                                fieldTitel={title}
                            />
                        )
                })}
            </div>

            {werkingsGebiedUUID && dataLoaded && (
                <Werkingsgebied
                    fullscreenLeafletViewer={fullscreenLeafletViewer}
                    setFullscreenLeafletViewer={setFullscreenLeafletViewer}
                    werkingsGebiedUUID={werkingsGebiedUUID}
                />
            )}
            {titleSingular === 'Maatregel' &&
                dataLoaded &&
                dataObject?.['Gebied_Duiding'] &&
                dataObject['Gebied'] && (
                    <ViewFieldGebiedDuiding
                        gebiedDuiding={dataObject['Gebied_Duiding']}
                    />
                )}
        </div>
    )
}

export default RaadpleegObjectDetailMain
