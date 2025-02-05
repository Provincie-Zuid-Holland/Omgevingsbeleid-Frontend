import { Hyperlink, Notification } from '@pzh-ui/components'
import { useMemo } from 'react'
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
            latest?.Public_Revisions?.find(
                revision => revision.Module_ID === parseInt(moduleId || '')
            ),
        [latest, moduleId]
    )

    const isTerminate = useMemo(
        () => isRevision && latestRevision?.Action === 'Terminate',
        [isRevision, latestRevision]
    )

    if (isRevision && isTerminate) {
        return (
            <Notification className="order-2 mt-4 [&_p]:first-letter:capitalize">
                <>
                    {demonstrative} {singularReadable} komt te vervallen met de
                    module '{latestRevision?.Module_Title}'
                </>
            </Notification>
        )
    }

    return (
        <div className="order-2 mt-4 flex flex-col gap-4">
            {latestRevision?.Module_Status === 'Vastgesteld' &&
                latestRevision?.Module_Object_UUID === data?.UUID && (
                    <Notification className="[&_p]:first-letter:capitalize">
                        {`${demonstrative} ${singularReadable} is vastgesteld, maar nog niet in werking getreden`}
                    </Notification>
                )}
            <Notification>
                {latestRevision?.Module_Object_UUID === data?.UUID ? (
                    <>
                        Let op, dit is een{' '}
                        {isRevision ? 'ontwerpversie' : 'verouderde versie'} van{' '}
                        {demonstrative} {singularReadable},{' '}
                        <Hyperlink asChild>
                            <Link
                                to={`/${slugOverview}/${plural}/${latest.UUID}`}>
                                bekijk hier de vigerende versie
                            </Link>
                        </Hyperlink>
                    </>
                ) : (
                    <>
                        Deze ontwerpversie is verouderd,{' '}
                        <Hyperlink asChild>
                            <Link
                                to={`/${slugOverview}/${plural}/ontwerpversie/${moduleId}/${latestRevision?.Module_Object_UUID}`}>
                                bekijk de nieuwste ontwerpversie hier
                            </Link>
                        </Hyperlink>
                    </>
                )}
            </Notification>
        </div>
    )
}

export default ObjectRevisionNotification
