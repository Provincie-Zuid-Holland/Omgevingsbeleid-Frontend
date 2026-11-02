import { useMemo } from 'react'

import { Hyperlink, Notification } from '@pzh-ui/components'

import { Link, useParams } from 'react-router-dom'

import { Model, ModelReturnType } from '@/config/objects/types'

interface ObjectRevisionNotificationProps {
    model: Model
    data: ModelReturnType
    latest: ModelReturnType
    isRevision?: boolean
}

const ObjectRevisionNotification = ({
    model,
    data,
    latest,
    isRevision,
}: ObjectRevisionNotificationProps) => {
    const { moduleId } = useParams()

    const {
        defaults: { demonstrative, slugOverview, singularReadable, plural },
    } = model

    const latestRevision = useMemo(
        () =>
            latest?.public_revisions?.find(
                revision => revision.module_id === parseInt(moduleId || '')
            ),
        [latest, moduleId]
    )

    const isTerminate = useMemo(
        () => isRevision && latestRevision?.action === 'Terminate',
        [isRevision, latestRevision]
    )

    if (isRevision && isTerminate) {
        return (
            <Notification className="order-2 mt-4 [&_p]:first-letter:capitalize">
                <>
                    {demonstrative} {singularReadable} komt te vervallen met de
                    module '{latestRevision?.module_title}'
                </>
            </Notification>
        )
    }

    return (
        <div className="order-2 mt-4 flex flex-col gap-4">
            {latestRevision?.module_status === 'Vastgesteld' &&
                latestRevision?.module_object_id === data?.id && (
                    <Notification className="[&_p]:first-letter:capitalize">
                        {`${demonstrative} ${singularReadable} is vastgesteld, maar nog niet in werking getreden`}
                    </Notification>
                )}
            <Notification>
                {latestRevision?.module_object_id === data?.id ||
                (!moduleId && latest.id !== data.id) ||
                !!!latestRevision ? (
                    <p>
                        Let op, dit is een{' '}
                        {isRevision ? 'ontwerpversie' : 'verouderde versie'} van{' '}
                        {demonstrative} {singularReadable},{' '}
                        <Hyperlink asChild>
                            <Link
                                to={`/${slugOverview}/${plural}/${latest.id}`}>
                                bekijk hier de meest actuele versie
                            </Link>
                        </Hyperlink>
                    </p>
                ) : (
                    <p>
                        Deze ontwerpversie is verouderd,{' '}
                        <Hyperlink asChild>
                            <Link
                                to={`/${slugOverview}/${plural}/ontwerpversie/${moduleId}/${latestRevision?.module_object_id}`}>
                                bekijk de nieuwste ontwerpversie hier
                            </Link>
                        </Hyperlink>
                    </p>
                )}
            </Notification>
        </div>
    )
}

export default ObjectRevisionNotification
