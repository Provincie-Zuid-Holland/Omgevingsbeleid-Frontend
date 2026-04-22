import {
    Divider,
    FieldCheckbox,
    FieldSelect,
    Text,
    getHeadingStyles,
} from '@pzh-ui/components'
import { useUpdateEffect } from '@react-hookz/web'
import classNames from 'clsx'
import { useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import ObjectContent from '@/components/DynamicObject/ObjectContent'
import ObjectRevision from '@/components/DynamicObject/ObjectRevision'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal'
import { Model, ModelReturnType } from '@/config/objects/types'
import useRevisionStore from '@/store/revisionStore'
import getRevisionLabel from '@/utils/getRevisionLabel'

type Option = {
    label: string
    value?: string
}

interface RevisionModalProps {
    isOpen: boolean
    onClose: () => void
    model: Model
    revisions?: ModelReturnType[]
    latestUUID?: string
}

const RevisionModal = ({
    model,
    revisions,
    latestUUID,
}: RevisionModalProps) => {
    const {
        initialObject,
        revisionFrom,
        revisionTo,
        setRevisionFrom,
        setRevisionTo,
    } = useRevisionStore(useShallow(state => ({ ...state })))

    /**
     * Format options for select fields
     */
    const options = useMemo(() => {
        if (!initialObject) return

        return revisions?.map(revision => ({
            label: getRevisionLabel(revision, initialObject, latestUUID),
            value: revision.UUID,
        }))
    }, [revisions, initialObject, latestUUID])

    const [isComparing, setIsComparing] = useState(false)

    const [revisionFromUuid, setRevisionFromUuid] = useState<
        string | undefined
    >(undefined)
    const [revisionToUuid, setRevisionToUuid] = useState<string | undefined>(
        undefined
    )

    const { singularReadable, prefixSingular, singularCapitalize, singular } =
        model.defaults
    const { useGetVersion } = model.fetchers

    const { isFetching: revisionFromFetching, refetch: refetchRevisionFrom } =
        useGetVersion!(revisionFromUuid || '', {
            query: { enabled: false, initialData: revisionFrom },
        })
    const { isFetching: revisionToFetching, refetch: refetchRevisionTo } =
        useGetVersion!(revisionToUuid || '', {
            query: { enabled: false },
        })

    const handleChange = (e: Option, type: 'from' | 'to') => {
        const option = options?.find(option => option.value === e.value)

        if (type === 'from') {
            setRevisionFromUuid(option?.value)
        } else {
            setRevisionToUuid(option?.value)
        }
    }

    useUpdateEffect(() => {
        if (revisionFromUuid) {
            refetchRevisionFrom().then(({ data }) => setRevisionFrom(data))
        }
    }, [revisionFromUuid])

    useUpdateEffect(() => {
        if (revisionToUuid) {
            refetchRevisionTo().then(({ data }) => setRevisionTo(data))
        }
    }, [revisionToUuid])

    const customTitle =
        singular === 'beleidskeuze'
            ? { Description: 'Wat wil de provincie bereiken?' }
            : singular === 'maatregel'
              ? { Description: 'Wat gaat de provincie doen?' }
              : undefined

    // Ensure the newest version is always revisionFrom and the older is always revisionTo
    const [orderedRevisionTo, orderedRevisionFrom] = useMemo(() => {
        if (!revisionFrom || !revisionTo) return [undefined, undefined]
        const fromDate = new Date(revisionFrom.Modified_Date || 0)
        const toDate = new Date(revisionTo.Modified_Date || 0)
        return fromDate >= toDate
            ? [revisionTo, revisionFrom]
            : [revisionFrom, revisionTo]
    }, [revisionFrom, revisionTo])

    const content =
        isComparing && orderedRevisionFrom && orderedRevisionTo ? (
            <ObjectRevision
                model={model}
                revisionFrom={orderedRevisionFrom}
                revisionTo={orderedRevisionTo}
            />
        ) : !isComparing && revisionFrom ? (
            <div>
                <Text bold className="block">
                    {singularCapitalize}
                </Text>
                <h2
                    className={classNames(
                        'text-pzh-blue-500 mb-4',
                        getHeadingStyles('l')
                    )}>
                    {revisionFrom.Title}
                </h2>
                <ObjectContent data={revisionFrom} customTitle={customTitle} />
            </div>
        ) : null

    return (
        <Modal id="revision" title="Versies bekijken en vergelijken">
            <Text className="mb-4">
                Bekijk en vergelijk de versies van {prefixSingular}{' '}
                {singularReadable} “{initialObject?.Title}”.
            </Text>
            <Text bold className="mb-2">
                Welke versie wil je bekijken?
            </Text>
            <div className="mb-2">
                <FieldSelect
                    name="revisionFrom"
                    placeholder="Kies een versie"
                    aria-label="Kies een versie"
                    options={
                        isComparing
                            ? options?.filter(
                                  option => option.value !== revisionTo?.UUID
                              )
                            : options
                    }
                    defaultValue={options?.find(
                        option => option.value === revisionFrom?.UUID
                    )}
                    onChange={e => handleChange(e as Option, 'from')}
                />
            </div>
            <FieldCheckbox onChange={e => setIsComparing(e.target.checked)}>
                Versies vergelijken
            </FieldCheckbox>
            {isComparing && (
                <div className="mt-2">
                    <Text bold className="mb-2">
                        Met welke versie wil je vergelijken?
                    </Text>
                    <FieldSelect
                        name="revisionTo"
                        placeholder="Kies een versie om te vergelijken"
                        aria-label="Kies een versie om te vergelijken"
                        options={options?.filter(
                            option => option.value !== revisionFrom?.UUID
                        )}
                        defaultValue={options?.find(
                            option => option.value === revisionTo?.UUID
                        )}
                        onChange={e => handleChange(e as Option, 'to')}
                    />
                </div>
            )}
            <Divider className="my-4" />

            <div className="inline-block min-h-[120px]">
                {revisionFromFetching || revisionToFetching ? (
                    <LoaderSpinner />
                ) : (
                    content
                )}
            </div>
        </Modal>
    )
}

export default RevisionModal
