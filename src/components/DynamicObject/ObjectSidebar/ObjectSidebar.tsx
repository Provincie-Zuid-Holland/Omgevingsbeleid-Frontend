import { Heading, Hyperlink, Text, formatDate } from '@pzh-ui/components'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import Avatar from '@/components/Avatar/Avatar'
import { LoaderCard } from '@/components/Loader'
import TableOfContents from '@/components/TableOfContents/TableOfContents'
import { Model, ModelReturnType } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import { getStaticDataLabel } from '@/utils/dynamicObject'

interface ObjectSidebarProps extends ModelReturnType {
    /** Model of object */
    model: Model
    /** Amount of revisions */
    revisions?: number
    /** Revisions loading */
    revisionsLoading?: boolean
    /** If object is a revision */
    isRevision?: boolean
    /** Handle revision modal state */
    handleModal: () => void
}

const ObjectSidebar = ({
    Start_Validity,
    End_Validity,
    revisions,
    revisionsLoading,
    Object_ID,
    ObjectStatics,
    model,
    isRevision,
    handleModal,
    Next_Version,
}: ObjectSidebarProps) => {
    const { user } = useAuth()
    const { moduleId } = useParams()

    const { plural, singular } = model.defaults

    const today = useMemo(() => formatDate(new Date(), 'd MMMM yyyy'), [])

    const formattedDate = useMemo(() => {
        const today = new Date()

        if (!Start_Validity || isRevision)
            return 'Nog niet geldig, versie in bewerking'

        if (
            (!Next_Version &&
                today > new Date(Start_Validity) &&
                !End_Validity) ||
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
            Next_Version?.Start_Validity &&
            today > new Date(Next_Version.Start_Validity)
        ) {
            return `Geldend van ${formatDate(
                new Date(Start_Validity),
                'd MMMM yyyy'
            )} tot ${formatDate(
                new Date(Next_Version.Start_Validity),
                'd MMMM yyyy'
            )}`
        }
    }, [Start_Validity, End_Validity, isRevision, Next_Version])

    return (
        <aside className="sticky top-[120px]">
            <div className="mb-6">
                <Heading level="3" size="m" className="mb-2">
                    Informatie
                </Heading>

                <Text>
                    Geraadpleegd op {today}.<br />
                    {formattedDate}
                </Text>

                {!isRevision && (
                    <div className="mt-2">
                        {revisionsLoading ? (
                            <LoaderCard height="30" mb="" className="w-28" />
                        ) : !!revisions && revisions > 0 ? (
                            <button
                                className="text-pzh-green-500 underline"
                                onClick={handleModal}>
                                Bekijk {revisions}{' '}
                                {revisions === 1 ? 'revisie' : 'revisies'}
                            </button>
                        ) : (
                            <span className="italic text-pzh-gray-600">
                                Geen revisies
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="mb-6">
                <Heading level="3" size="m" className="mb-2">
                    Inhoudsopgave
                </Heading>

                <TableOfContents />
            </div>

            {!!user && (
                <div>
                    <Text size="s" className="text-pzh-blue-900 mb-3 italic">
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
                    <Hyperlink asChild>
                        <Link
                            to={
                                isRevision && !!moduleId
                                    ? `/muteer/modules/${moduleId}/${singular}/${Object_ID}`
                                    : `/muteer/${plural}/${Object_ID}`
                            }>
                            Open in beheeromgeving
                        </Link>
                    </Hyperlink>
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
                <div className="mr-2 flex">
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
