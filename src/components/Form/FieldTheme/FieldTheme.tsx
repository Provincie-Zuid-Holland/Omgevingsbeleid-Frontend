import { FieldSelectProps, FormikSelect } from '@pzh-ui/components'

import { usePublicationValueListsGetThema } from '@/api/fetchers'

const FieldTheme = ({ ...props }: FieldSelectProps) => {
    const { data, isLoading } = usePublicationValueListsGetThema({
        query: {
            select: data =>
                data.themas
                    .filter(theme => !theme.deprecated)
                    .map(theme => ({ label: theme.term, value: theme.label })),
        },
    })

    return (
        <FormikSelect
            key={props.name + isLoading.toString()}
            {...props}
            options={data}
            isLoading={isLoading}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isMulti
        />
    )
}

export default FieldTheme
