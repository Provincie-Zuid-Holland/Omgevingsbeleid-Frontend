import { Heading, Hyperlink, Text, formatDate } from '@pzh-ui/components'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import Avatar from '@/components/Avatar/Avatar'
import { LoaderCard } from '@/components/Loader'
import { Model, ModelReturnType } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import { getStaticDataLabel } from '@/utils/dynamicObject'
import { formatValidityDate } from '@/utils/formatValidityDate'
import ObjectConnectedDocuments from '../ObjectConnectedDocuments'

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
    Documents_Statics,
}: ObjectSidebarProps) => {
    const { user } = useAuth()
    const { moduleId } = useParams()

    const { plural, singular } = model.defaults

    const today = useMemo(() => formatDate(new Date(), 'd MMMM yyyy'), [])

    const formattedDate = useMemo(
        () =>
            formatValidityDate({
                UUID,
                Start_Validity,
                End_Validity,
                isRevision,
                Next_Version,
                revisions,
            }),
        [
            Start_Validity,
            End_Validity,
            isRevision,
            Next_Version,
            revisions,
            UUID,
        ]
    )

    return (
        <aside className="sticky top-[120px]">
            <div className="mb-6">
                <Heading level="2" size="m" className="mb-2">
                    Informatie
                </Heading>

                <Text>
                    Geraadpleegd op {today}.<br />
                    {formattedDate}
                </Text>

                <div className="mt-2">
                    {revisionsLoading ? (
                        <LoaderCard height="30" mb="" className="w-28" />
                    ) : !!revisions && revisions.length > 1 ? (
                        <button
                            className="text-pzh-green-500 underline"
                            onClick={handleModal}>
                            Bekijk {revisions.length - 1}{' '}
                            {revisions.length === 2 ? 'revisie' : 'revisies'}
                        </button>
                    ) : (
                        <span className="text-pzh-gray-600 italic">
                            Geen revisies
                        </span>
                    )}
                </div>
            </div>

            {!!Documents_Statics?.length && (
                <div className="mb-6">
                    <ObjectConnectedDocuments documents={Documents_Statics} />
                </div>
            )}

            {!!user && (
                <div>
                    <Text size="s" className="text-pzh-blue-900 mb-3 italic">
                        Onderstaande informatie is alleen inzichtelijk voor
                        gebruikers die zijn ingelogd.
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
