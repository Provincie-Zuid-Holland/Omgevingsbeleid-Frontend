import { FieldLabel, FormikDate, Text } from '@pzh-ui/components'
import { AngleDown, AngleUp } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useFormikContext } from 'formik'
import { motion } from 'framer-motion'
import { FC, Fragment, useRef, useState } from 'react'

import { useGetGebruikers } from '@/api/fetchers'
import { FormFieldWerkingsgebied } from '@/components/Form'
import FormikSelectUser from '@/components/Form/FormikSelectUser'

import { FormikValues } from '../../verordeningEditContext'

export interface FormArticleSidebarProps {}

function FormArticleSidebar({}: FormArticleSidebarProps) {
    const { values, setFieldValue } = useFormikContext<FormikValues>()
    const { data: users } = useGetGebruikers()

    const [allSubSectionsHaveSameGeoArea, setAllSubSectionsHaveSameGeoArea] =
        useState(false)

    const options = users
        ? users
              .map(user => ({
                  value: user.UUID || '',
                  label: user.Gebruikersnaam || '',
                  role: user.Rol || '',
              }))
              .sort((a, b) => (a.label > b.label ? 1 : -1))
        : []

    if (!values) return null

    return (
        <SidebarScrollContainer>
            <SidebarContainer
                title={`Eigenschappen Artikel ${values?.Volgnummer || ''}`}>
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
                        name="Portefeuillehouder_2"
                        label="Tweede portefeuillehouder"
                    />
                    <FormikSelectUser
                        property="Portefeuillehouder_2"
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

                {/* This section is shown when there are no sub sections, 
                or when all the sub sections should have the same GEO area */}
                {!values?.Children || allSubSectionsHaveSameGeoArea ? (
                    <div className="mt-6">
                        <FieldLabel name="Gebied" label="Gebied" />
                        <FormFieldWerkingsgebied
                            setWerkingsgebiedInParentState={event => {
                                if (
                                    allSubSectionsHaveSameGeoArea &&
                                    values.Children
                                ) {
                                    values.Children.forEach((child, index) => {
                                        setFieldValue(
                                            `Children[${index}].Gebied`,
                                            event.target.value
                                        )
                                    })
                                } else {
                                    setFieldValue('Gebied', event.target.value)
                                }
                            }}
                            werkingsgebiedInParentState={
                                allSubSectionsHaveSameGeoArea &&
                                values.Children &&
                                values.Children[0]
                                    ? values.Children[0]?.Gebied
                                    : values.Gebied
                            }
                            dataObjectProperty="Gebied"
                            titleSingular="Artikel"
                            hideLabel={true}
                        />
                    </div>
                ) : null}

                {values?.Children && values.Children.length > 1 && (
                    <div className="mt-6">
                        <label className="flex">
                            <input
                                id="inherit-werkingsgebieden-from-artikel"
                                type="checkbox"
                                className="mt-1 mr-3 text-pzh-green"
                                checked={allSubSectionsHaveSameGeoArea}
                                onChange={() => {
                                    if (
                                        !allSubSectionsHaveSameGeoArea &&
                                        values.Children
                                    ) {
                                        // User ticks the checkbox -> Remove GEO value from each lid
                                        values.Children.forEach(
                                            (child, index) => {
                                                setFieldValue(
                                                    `Children[${index}].Gebied`,
                                                    null
                                                )
                                            }
                                        )
                                        setAllSubSectionsHaveSameGeoArea(true)
                                    } else if (values.Children) {
                                        // User unticks the checkbox
                                        setAllSubSectionsHaveSameGeoArea(false)
                                    }
                                }}
                            />
                            <Text type="body-small">
                                Alle leden van dit artikel gaan over hetzelfde
                                werkingsgebied
                            </Text>
                        </label>
                    </div>
                )}
            </SidebarContainer>
            {values?.Children !== undefined &&
                allSubSectionsHaveSameGeoArea === false &&
                values.Children.map((child, index) => (
                    <SidebarContainer
                        mt
                        key={index}
                        title={`Eigenschappen lid ${index + 1}`}>
                        <FieldLabel name="Gebied" label="Gebied" />
                        <FormFieldWerkingsgebied
                            setWerkingsgebiedInParentState={event =>
                                setFieldValue(
                                    `Children[${index}].Gebied`,
                                    event.target.value
                                )
                            }
                            werkingsgebiedInParentState={
                                values.Children
                                    ? values.Children[index]?.Gebied
                                    : null
                            }
                            dataObjectProperty="Gebied"
                            titleSingular="Artikel"
                            hideLabel={true}
                        />
                    </SidebarContainer>
                ))}
        </SidebarScrollContainer>
    )
}

const SidebarScrollContainer: FC = ({ children }) => {
    const sidebarContainer = useRef(null)
    const topNavigationHeight =
        document.getElementById('top-navigation')?.clientHeight || 0
    const windowHeight = window.innerHeight || 0

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, top: -20 }}
            animate={{ opacity: 1, scale: 1, top: 0 }}
            className="relative overflow-x-visible overflow-y-auto">
            <div
                ref={sidebarContainer}
                style={{
                    maxHeight: `calc(${windowHeight}px - ${topNavigationHeight}px - 2rem - 70px)`,
                }}
                className={`relative rounded overflow-y-auto rounded-b`}>
                {children}
            </div>
        </motion.div>
    )
}

interface SidebarContainerProps {
    title: string
    mt?: boolean
}

const SidebarContainer: FC<SidebarContainerProps> = ({
    children,
    title,
    mt,
}) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <Fragment>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={classNames(
                    'flex items-center z-10 justify-between w-full p-4 rounded-t bg-pzh-blue hover:bg-pzh-blue-dark',
                    {
                        'rounded-t': isOpen,
                        rounded: !isOpen,
                        'mt-6': mt,
                    }
                )}>
                <Text className="font-bold text-white">{title}</Text>
                {isOpen ? (
                    <AngleDown className="text-white" size={18} />
                ) : (
                    <AngleUp className="text-white" size={18} />
                )}
            </button>
            {isOpen && <div className="p-4 bg-white border">{children}</div>}
        </Fragment>
    )
}

export default FormArticleSidebar
