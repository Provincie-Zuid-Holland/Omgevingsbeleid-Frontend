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
    /** Revisions */
    revisions?: ModelReturnType[]
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
    UUID,
}: ObjectSidebarProps) => {
    const { user } = useAuth()
    const { moduleId } = useParams()

    const { plural, singular } = model.defaults

    const today = useMemo(() => formatDate(new Date(), 'd MMMM yyyy'), [])

    const formattedDate = useMemo(() => {
        const today = new Date()
        const startDate = Start_Validity ? new Date(Start_Validity) : null
        const endDate = End_Validity ? new Date(End_Validity) : null
        const nextStartDate = Next_Version?.Start_Validity
            ? new Date(Next_Version.Start_Validity)
            : null

        if (!startDate || isRevision) {
            return 'Nog niet geldig, versie in bewerking'
        }

        const isCurrentlyValid =
            today > startDate && (!endDate || today <= endDate)
        const hasNextVersionStarted = nextStartDate && today > nextStartDate

        if (isCurrentlyValid) {
            if (!Next_Version) {
                return `Geldend van ${formatDate(
                    startDate,
                    'dd-MM-yyyy'
                )} t/m heden`
            }
            if (hasNextVersionStarted) {
                return `Geldend van ${formatDate(
                    startDate,
                    'dd-MM-yyyy'
                )} tot ${formatDate(nextStartDate, 'dd-MM-yyyy')}`
            }
        }

        if (endDate && revisions?.length) {
            const currentIndex = revisions.findIndex(
                revision => revision.UUID === UUID
            )
            if (currentIndex !== -1 && currentIndex < revisions.length - 1) {
                const prevRevision = revisions[currentIndex + 1]
                const prevStartDate = prevRevision.Start_Validity
                    ? new Date(prevRevision.Start_Validity)
                    : null

                if (prevStartDate) {
                    return `Geldend van ${formatDate(
                        prevStartDate,
                        'dd-MM-yyyy'
                    )} t/m ${formatDate(endDate, 'dd-MM-yyyy')}`
                }
            }
        }
    }, [
        Start_Validity,
        End_Validity,
        isRevision,
        Next_Version,
        revisions,
        UUID,
    ])

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
                        ) : !!revisions && revisions.length > 1 ? (
                            <button
                                className="text-pzh-green-500 underline"
                                onClick={handleModal}>
                                Bekijk {revisions.length - 1}{' '}
                                {revisions.length === 2
                                    ? 'revisie'
                                    : 'revisies'}
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
                    <Text size="s" className="mb-3 italic text-pzh-blue-900">
                        Onderstaande informatie is alleen inzichtelijk voor
                        gebruikers die zijn ingelogd
                    </Text>

                    <People ObjectStatics={ObjectStatics} />

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
                            uuid={ObjectStatics.Portfolio_Holder_1.UUID}
                            prefix={getStaticDataLabel(
                                'Portfolio_Holder_1_UUID'
                            )}
                        />
                    )}
                    {ObjectStatics.Portfolio_Holder_2 && (
                        <Avatar
                            uuid={ObjectStatics.Portfolio_Holder_2.UUID}
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
                        uuid={ObjectStatics.Client_1.UUID}
                        prefix={getStaticDataLabel('Client_1_UUID')}
                    />
                </div>
            )}

            {(ObjectStatics.Owner_1 || ObjectStatics.Owner_2) && (
                <div className="flex">
                    {ObjectStatics.Owner_1 && (
                        <Avatar
                            uuid={ObjectStatics.Owner_1.UUID}
                            prefix={getStaticDataLabel('Owner_1_UUID')}
                        />
                    )}
                    {ObjectStatics.Owner_2 && (
                        <Avatar
                            uuid={ObjectStatics.Owner_2.UUID}
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
