import { useFormikContext } from 'formik'
import Select from 'react-select'

import { GebruikersInline } from '@/api/fetchers.schemas'

export interface FormikSelectUserProps {
    property:
        | 'Eigenaar_1'
        | 'Eigenaar_2'
        | 'Portefeuillehouder_1'
        | 'Portefeuillehouder_2'
        | 'Opdrachtgever'
    filter:
        | 'Ambtelijk opdrachtgever'
        | 'Behandelend Ambtenaar'
        | 'Portefeuillehouder'
    options: {
        value: string
        label: string
        role: string
    }[]
}

interface SelectUserValues {
    Eigenaar_1: null | GebruikersInline
    Eigenaar_2: null | GebruikersInline
    Portefeuillehouder_1: null | GebruikersInline
    Portefeuillehouder_2: null | GebruikersInline
    Opdrachtgever: null | GebruikersInline
}

const FormikSelectUser = ({
    property,
    filter,
    options,
}: FormikSelectUserProps) => {
    const { values, setFieldValue } = useFormikContext<SelectUserValues>()

    if (!values) return null

    return (
        <Select
            className="border border-gray-400 rounded hover:border-gray-500 focus:border-gray-500"
            name={property}
            value={
                values
                    ? {
                          value: values[property]?.UUID,
                          label: values[property]?.Gebruikersnaam,
                          role: values[property]?.Rol,
                      }
                    : {}
            }
            onChange={(e, metaInfo) => {
                if (e && metaInfo.action === 'select-option') {
                    setFieldValue(property, {
                        UUID: e.value,
                        Gebruikersnaam: e.label,
                        Rol: e.role,
                    })
                } else if (e && metaInfo.action === 'clear') {
                    setFieldValue(property, null)
                }
            }}
            isClearable={true}
            options={options.filter(option => option.role === filter)}
            placeholder={`Selecteer...`}
        />
    )
}
export default FormikSelectUser
