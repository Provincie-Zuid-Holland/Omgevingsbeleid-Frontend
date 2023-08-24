import { Heading, Hyperlink, Text, formatDate } from '@pzh-ui/components'
import { useMemo } from 'react'

import Avatar from '@/components/Avatar/Avatar'
import TableOfContents from '@/components/TableOfContents/TableOfContents'
import { ModelReturnType } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import { getStaticDataLabel } from '@/utils/dynamicObject'

interface ObjectSidebarProps extends ModelReturnType {
    /** Plural of object */
    plural: string
    /** Amount of revisions */
    revisions?: number
    /** Handle revision modal state */
    handleModal: () => void
}

const ObjectSidebar = ({
    Start_Validity,
    End_Validity,
    revisions,
    Object_ID,
    ObjectStatics,
    plural,
    handleModal,
}: ObjectSidebarProps) => {
    const { user } = useAuth()

    const today = useMemo(() => formatDate(new Date(), 'd MMMM yyyy'), [])

    const formattedDate = useMemo(() => {
        const today = new Date()

        if (!Start_Validity) return 'Nog niet geldig, versie in bewerking'

        if (
            (today > new Date(Start_Validity) && !End_Validity) ||
            (today > new Date(Start_Validity) &&
                End_Validity &&
                today <= new Date(End_Validity))
        ) {
            return `Geldend van ${formatDate(
                new Date(Start_Validity),
                'd MMMM yyyy'
            )} t/m heden`
        } else if (
            today > new Date(Start_Validity) &&
            End_Validity &&
            today > new Date(End_Validity)
        ) {
            return `Geldend van ${formatDate(
                new Date(Start_Validity),
                'd MMMM yyyy'
            )} t/m ${formatDate(new Date(End_Validity), 'd MMMM yyyy')}`
        }
    }, [Start_Validity, End_Validity])

    return (
        <aside className="sticky top-[120px]">
            <div className="mb-6">
                <Heading level="3" className="mb-2">
                    Informatie
                </Heading>

                <Text>
                    Geraadpleegd op {today}.<br />
                    {formattedDate}
                </Text>

                <div className="mt-2">
                    {!!revisions && revisions > 0 ? (
                        <button
                            className="text-pzh-green underline"
                            onClick={handleModal}>
                            Bekijk {revisions}{' '}
                            {revisions === 1 ? 'revisie' : 'revisies'}
                        </button>
                    ) : (
                        <span className="text-pzh-gray-600 italic">
                            Geen revisies
                        </span>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <Heading level="3" className="mb-2">
                    Inhoudsopgave
                </Heading>

                <TableOfContents />
            </div>

            {!!user && (
                <div>
                    <Text
                        type="body-small"
                        className="mb-3 italic text-pzh-blue-dark">
                        Onderstaande informatie is alleen inzichtelijk voor
                        gebruikers die zijn ingelogd
                    </Text>

                    <People ObjectStatics={ObjectStatics} />

                    {/* <Text className="block mb-2">
                        Besluitnummer: {Decision_Number}
                    </Text>
                    {Decision_Number && (
                        <div className="mb-1">
                            <Hyperlink
                                text="Open het besluitdocument"
                                to={`/`}
                            />
                        </div>
                    )} */}
                    <Hyperlink
                        text="Open in beheeromgeving"
                        to={`/muteer/${plural}/${Object_ID}`}
                    />
                </div>
            )}
        </aside>
    )
}

const People = ({
    ObjectStatics,
}: Pick<ObjectSidebarProps, 'ObjectStatics'>) => {
    if (!ObjectStatics) return null

    return (
        <div className="mb-3 flex">
            {(ObjectStatics.Portfolio_Holder_1 ||
                ObjectStatics.Portfolio_Holder_2) && (
                <div className="flex mr-2">
                    {ObjectStatics.Portfolio_Holder_1 && (
                        <Avatar
                            name={
                                ObjectStatics.Portfolio_Holder_1.Gebruikersnaam
                            }
                            prefix={getStaticDataLabel(
                                'Portfolio_Holder_1_UUID'
                            )}
                        />
                    )}
                    {ObjectStatics.Portfolio_Holder_2 && (
                        <Avatar
                            name={
                                ObjectStatics.Portfolio_Holder_2.Gebruikersnaam
                            }
                            prefix={getStaticDataLabel(
                                'Portfolio_Holder_2_UUID'
                            )}
                            className={
                                ObjectStatics.Portfolio_Holder_1 && '-ml-2'
                            }
                        />
                    )}
                </div>
            )}

            {ObjectStatics.Client_1 && (
                <div className="mr-2">
                    <Avatar
                        name={ObjectStatics.Client_1.Gebruikersnaam}
                        prefix={getStaticDataLabel('Client_1_UUID')}
                    />
                </div>
            )}

            {(ObjectStatics.Owner_1 || ObjectStatics.Owner_2) && (
                <div className="flex">
                    {ObjectStatics.Owner_1 && (
                        <Avatar
                            name={ObjectStatics.Owner_1.Gebruikersnaam}
                            prefix={getStaticDataLabel('Owner_1_UUID')}
                        />
                    )}
                    {ObjectStatics.Owner_2 && (
                        <Avatar
                            name={ObjectStatics.Owner_2.Gebruikersnaam}
                            prefix={getStaticDataLabel('Owner_2_UUID')}
                            className={ObjectStatics.Owner_1 && '-ml-2'}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default ObjectSidebar
