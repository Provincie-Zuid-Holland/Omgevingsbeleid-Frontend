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
            {!!values?.Role && (
                <Notification className="mt-2">
                    <p>
                        De eerder gekozen sturingsstijl was{' '}
                        <span className="font-bold">{values.Role}</span>
                    </p>
                </Notification>
            )}
        </>
    )
}

export default FieldRoles
