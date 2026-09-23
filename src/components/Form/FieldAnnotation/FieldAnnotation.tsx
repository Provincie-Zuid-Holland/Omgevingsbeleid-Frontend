import { useMemo } from 'react'

import { FieldSelectProps, FormikSelect } from '@pzh-ui/components'

import debounce from 'lodash.debounce'

import {
    hoofdlijnPostHoofdlijnenSearch,
    useHoofdlijnGetHoofdlijnenList,
} from '@/api/fetchers'

type Option = {
    label: string
    value: string
}

const mapOptions = (
    results: Array<{ Name: string; Type: string; UUID: string }>
) =>
    results.map(item => ({
        label: `${item.Name} (${item.Type})`,
        value: item.UUID,
    }))

const FieldAnnotation = ({ ...props }: FieldSelectProps) => {
    const { data, isLoading } = useHoofdlijnGetHoofdlijnenList(
        { limit: 100 },
        {
            query: {
                select: data => mapOptions(data.results),
            },
        }
    )

    const loadOptions = useMemo(
        () =>
            debounce((query: string, callback: (options: Option[]) => void) => {
                void hoofdlijnPostHoofdlijnenSearch({
                    query,
                    limit: 100,
                })
                    .then(result => {
                        callback(mapOptions(result.results))
                    })
                    .catch(() => {
                        callback([])
                    })
            }, 500),
        []
    )

    return (
        <FormikSelect
            key={props.name + isLoading.toString()}
            {...props}
            options={data}
            defaultOptions={data}
            isLoading={isLoading}
            loadOptions={loadOptions}
            isAsync
            cacheOptions
            filterOption={() => true}
            isMulti
        />
    )
}

export default FieldAnnotation
