import { useMemo } from 'react'

import {
    Button,
    formatDate,
    Heading,
    Hyperlink,
    Text,
    Tooltip,
} from '@pzh-ui/components'

import { Link, useParams } from 'react-router-dom'

import Avatar from '@/components/Avatar/Avatar'
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
    hideRevisions?: boolean
    /** Handle revision modal state */
    handleModal?: () => void
}

const ObjectSidebar = ({
    start_validity,
    end_validity,
    revisions,
    revisionsLoading,
    object_id,
    object_statics: ObjectStatics,
    model,
    isRevision,
    hideRevisions,
    handleModal,
    next_version,
    id,
    documents_statics,
}: ObjectSidebarProps) => {
    const { user } = useAuth()
    const { moduleId } = useParams()

    const { plural, singular } = model.defaults

    const today = useMemo(() => formatDate(new Date(), 'd MMMM yyyy'), [])

    const formattedDate = useMemo(
        () =>
            formatValidityDate({
                id,
                start_validity,
                end_validity,
                isRevision,
                next_version,
                revisions,
            }),
        [start_validity, end_validity, isRevision, next_version, revisions, id]
    )

    const hasMultipleVersions = !!revisions && revisions.length > 1

    const revisionsButton = (
        <Button
            variant="primary"
            isDisabled={!hasMultipleVersions}
            isLoading={revisionsLoading}
            onPress={hasMultipleVersions ? handleModal : undefined}>
            Versies bekijken en vergelijken
        </Button>
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

                {!hideRevisions &&
                    (hasMultipleVersions ? (
                        <div className="mt-2">{revisionsButton}</div>
                    ) : (
                        <div className="mt-2">
                            <Tooltip
                                label={`Er zijn geen andere versies van ${model.defaults.demonstrative} ${model.defaults.singularReadable}`}
                                placement="bottom">
                                {revisionsButton}
                            </Tooltip>
                        </div>
                    ))}
            </div>

            {!!documents_statics?.length && (
                <div className="group">
                    <ObjectConnectedDocuments documents={documents_statics} />
                </div>
            )}

            {!!user && (
                <div>
                    <Text size="s" className="mb-3 text-pzh-blue-900 italic">
                        Onderstaande informatie is alleen inzichtelijk voor
                        gebruikers die zijn ingelogd.
                    </Text>

                    <People object_statics={ObjectStatics} />

                    <Hyperlink asChild>
                        <Link
                            to={
                                isRevision && !!moduleId
                                    ? `/muteer/modules/${moduleId}/${singular}/${object_id}`
                                    : `/muteer/${plural}/${object_id}`
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
    object_statics: ObjectStatics,
}: Pick<ObjectSidebarProps, 'object_statics'>) => {
    if (!ObjectStatics) return null

    return (
        <div className="mb-3 flex">
            {ObjectStatics.portfolio_holder_1 && (
                <div className="mr-2 flex">
                    {ObjectStatics.portfolio_holder_1 && (
                        <Avatar
                            id={ObjectStatics.portfolio_holder_1.id}
                            prefix={getStaticDataLabel('portfolio_holder_1_id')}
                        />
                    )}
                </div>
            )}

            {ObjectStatics.client_1 && (
                <div className="mr-2">
                    <Avatar
                        id={ObjectStatics.client_1.id}
                        prefix={getStaticDataLabel('client_1_id')}
                    />
                </div>
            )}

            {(ObjectStatics.owner_1 ||
                ObjectStatics.owner_2 ||
                ObjectStatics.owner_3) && (
                <div className="flex">
                    {ObjectStatics.owner_1 && (
                        <Avatar
                            id={ObjectStatics.owner_1.id}
                            prefix={getStaticDataLabel('owner_1_id')}
                        />
                    )}
                    {ObjectStatics.owner_2 && (
                        <Avatar
                            id={ObjectStatics.owner_2.id}
                            prefix={getStaticDataLabel('owner_2_id')}
                            className={ObjectStatics.owner_1 && '-ml-2'}
                        />
                    )}
                    {ObjectStatics.owner_3 && (
                        <Avatar
                            id={ObjectStatics.owner_3.id}
                            prefix={getStaticDataLabel('owner_3_id')}
                            className={
                                (ObjectStatics.owner_1 ||
                                    ObjectStatics.owner_2) &&
                                '-ml-2'
                            }
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default ObjectSidebar
