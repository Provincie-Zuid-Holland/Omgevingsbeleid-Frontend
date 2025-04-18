import { Divider, FieldSelect, Text } from '@pzh-ui/components'
import { useUpdateEffect } from '@react-hookz/web'
import { useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

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

    const [revisionFromUuid, setRevisionFromUuid] = useState<
        string | undefined
    >(undefined)
    const [revisionToUuid, setRevisionToUuid] = useState<string | undefined>(
        undefined
    )

    const { singularReadable, prefixSingular } = model.defaults
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

    return (
        <Modal id="revision" title="Revisieoverzicht" size="m">
            <Text className="mb-4">
                Vergelijk de versies van {prefixSingular} {singularReadable} “
                {initialObject?.Title}”.
            </Text>
            <Text bold className="mb-2">
                Welke versies wil je vergelijken?
            </Text>
            <div className="mb-2">
                <FieldSelect
                    name="revisionFrom"
                    placeholder="Kies een versie"
                    options={options?.filter(
                        option => option.value !== revisionTo?.UUID
                    )}
                    defaultValue={options?.find(
                        option => option.value === revisionFrom?.UUID
                    )}
                    onChange={e => handleChange(e as Option, 'from')}
                />
            </div>
            <FieldSelect
                name="revisionTo"
                placeholder="Kies een versie"
                options={options?.filter(
                    option => option.value !== revisionFrom?.UUID
                )}
                defaultValue={options?.find(
                    option => option.value === revisionTo?.UUID
                )}
                onChange={e => handleChange(e as Option, 'to')}
            />
            <Divider className="my-4" />

            <div className="inline-block min-h-[120px]">
                {revisionFromFetching || revisionToFetching ? (
                    <LoaderSpinner />
                ) : (
                    !!revisionFrom &&
                    !!revisionTo && (
                        <ObjectRevision
                            model={model}
                            revisionFrom={revisionFrom}
                            revisionTo={revisionTo}
                            latestUUID={latestUUID}
                        />
                    )
                )}
            </div>
        </Modal>
    )
}

export default RevisionModal
