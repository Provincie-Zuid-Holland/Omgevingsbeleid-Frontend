import {
    FieldSelectProps,
    FormikSelect,
    Notification,
} from '@pzh-ui/components'

import useObject from '@/hooks/useObject'

const FieldRoles = ({ ...props }: FieldSelectProps) => {
    const { data: values } = useObject()

    return (
        <>
            <FormikSelect {...props} />
            {!!values?.role && (
                <Notification className="mt-2">
                    <p>
                        De eerder gekozen sturingsstijl was{' '}
                        <span className="font-bold">{values.role}</span>
                    </p>
                </Notification>
            )}
        </>
    )
}

export default FieldRoles
