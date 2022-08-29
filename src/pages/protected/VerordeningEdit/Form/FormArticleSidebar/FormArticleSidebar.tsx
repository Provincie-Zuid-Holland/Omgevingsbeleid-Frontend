import { FieldLabel, FormikDate, Text } from '@pzh-ui/components'
import { AngleDown, AngleUp } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useFormikContext } from 'formik'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, useRef, useState } from 'react'
import Select from 'react-select'

import { useGetGebruikers } from '@/api/fetchers'
import { GebruikersInline } from '@/api/fetchers.schemas'
import {
    FormFieldSelectUserGroup,
    FormFieldWerkingsgebied,
} from '@/components/Form'
import FormikWerkingsgebied from '@/components/Form/FormikWerkingsgebied'

import { ActiveSectionData } from '../../verordeningEditContext'

export interface FormArticleSidebarProps {}

function FormArticleSidebar({}: FormArticleSidebarProps) {
    const { values, setFieldValue } = useFormikContext<ActiveSectionData>()
    const { isLoading: usersAreLoading, data: users } = useGetGebruikers()

    const options = users
        ? users.map(user => ({
              value: user.UUID || '',
              label: user.Gebruikersnaam || '',
              role: user.Rol || '',
          }))
        : []

    if (!values) return null

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, top: -20 }}
            animate={{ opacity: 1, scale: 1, top: 0 }}
            className="relative overflow-y-auto">
            <SidebarContainer
                title={`Eigenschappen Artikel ${values.Volgnummer}`}>
                <div>
                    <FieldLabel name="Eigenaar_1" label="Eerste Eigenaar" />
                    <FormikSelectUser
                        property="Eigenaar_1"
                        options={options}
                        filter="Ambtelijk opdrachtgever"
                    />
                </div>

                <div className="mt-6">
                    <FieldLabel name="Eigenaar_2" label="Tweede Eigenaar" />
                    <FormikSelectUser
                        property="Eigenaar_2"
                        options={options}
                        filter="Ambtelijk opdrachtgever"
                    />
                </div>

                <div className="mt-6">
                    <FieldLabel name="Opdrachtgever" label="Opdrachtgever" />
                    <FormikSelectUser
                        property="Opdrachtgever"
                        options={options}
                        filter="Ambtelijk opdrachtgever"
                    />
                </div>

                <div className="mt-6">
                    <FieldLabel
                        name="Portefeuillehouder_1"
                        label="Eerste portefeuillehouder"
                    />
                    <FormikSelectUser
                        property="Portefeuillehouder_1"
                        options={options}
                        filter="Portefeuillehouder"
                    />
                </div>

                <div className="mt-6">
                    <FieldLabel
                        name="Portefeuillehouder_1"
                        label="Eerste portefeuillehouder"
                    />
                    <FormikSelectUser
                        property="Portefeuillehouder_1"
                        options={options}
                        filter="Portefeuillehouder"
                    />
                </div>

                <div className="mt-6">
                    <FieldLabel
                        name="Begin_Geldigheid"
                        label="Datum inwerkingtreding"
                    />
                    <FormikDate name="Begin_Geldigheid" />
                </div>

                <div className="mt-6">
                    <FieldLabel
                        name="Eind_Geldigheid"
                        label="Datum uitwerkingtreding"
                    />
                    <FormikDate name="Eind_Geldigheid" />
                </div>

                <div className="mt-6">
                    <FieldLabel name="Gebied" label="Gebied" />
                    <FormFieldWerkingsgebied
                        setWerkingsgebiedInParentState={event =>
                            setFieldValue('Gebied', event.target.value)
                        }
                        werkingsgebiedInParentState={values.Gebied}
                        dataObjectProperty="Gebied"
                        titleSingular="Artikel"
                        hideLabel={true}
                    />
                </div>
                {/* <FormikWerkingsgebied
                    dataObjectProperty="Gebied"
                    titleSingular="Artikel"
                    label="Gebied"
                    description="Selecteer een gebied om te koppelen aan dit artikel"
                /> */}
            </SidebarContainer>
        </motion.div>
    )
}

interface FormikSelectUserProps {
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

const FormikSelectUser = ({
    property,
    filter,
    options,
}: FormikSelectUserProps) => {
    const { values, setFieldValue } = useFormikContext<ActiveSectionData>()

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

interface SidebarContainerProps {
    title: string
}

const SidebarContainer: FC<SidebarContainerProps> = ({ children, title }) => {
    const [isOpen, setIsOpen] = useState(true)
    const sidebarContainer = useRef(null)
    const topNavigationHeight =
        document.getElementById('top-navigation')?.clientHeight || 0
    const windowHeight = window.innerHeight || 0

    return (
        <div
            ref={sidebarContainer}
            style={{
                maxHeight: `calc(${windowHeight}px - ${topNavigationHeight}px - 2rem - 70px)`,
            }}
            className="relative overflow-y-auto rounded-b shadow-md">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={classNames(
                    'flex items-center z-10 justify-between w-full p-4 rounded-t bg-pzh-blue hover:bg-pzh-blue-dark',
                    {
                        'rounded-t': isOpen,
                        rounded: !isOpen,
                    }
                )}>
                <Text className="font-bold text-white">{title}</Text>
                {isOpen ? (
                    <AngleDown className="text-white" size={18} />
                ) : (
                    <AngleUp className="text-white" size={18} />
                )}
            </button>
            {isOpen && <div className="p-4 bg-white">{children}</div>}
        </div>
    )
}

export default FormArticleSidebar
