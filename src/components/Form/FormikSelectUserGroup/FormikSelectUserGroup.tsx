import { FormikSelect } from '@pzh-ui/components'
import classNames from 'classnames'
import { useFormikContext } from 'formik'
import { useCallback, useEffect, useState } from 'react'

import { useGebruikers } from '@/api/fetchers'
import {
    Beleidskeuze,
    GebruikerInline,
    Maatregel,
} from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'

interface OptionType {
    value: string
    label: string
}

interface FormattedUserList {
    Opdrachtgever: OptionType[]
    Eigenaar_1: OptionType[]
    Eigenaar_2: OptionType[]
    Portefeuillehouder_1: OptionType[]
    Portefeuillehouder_2: OptionType[]
}

/**
 * Displays the user group component, by first getting the users through axios and adding it to the gebruikersLijst variable.
 * Then loading the values of the gebruikersLijst variable in the dropdown element of the FormFieldSelectUser component based on the role filter.
 *
 * @param {object} crudObject - Contains the object that can be edited.
 * @param {boolean} editStatus - Contains a boolean indicating if the page is for a new object, or an existing object
 * @param {function} handleChange - Function change handler.
 * @param {string} titleSingular - Title of the object in a singular form.
 * @param {boolean} disabled - Disables the component.
 */

export interface FormikSelectUserGroupProps {
    disabled?: boolean
    className?: string
}

const initialState = {
    Opdrachtgever: [],
    Eigenaar_1: [],
    Eigenaar_2: [],
    Portefeuillehouder_1: [],
    Portefeuillehouder_2: [],
}

const FormikSelectUserGroup = ({
    disabled,
    className = '',
}: FormikSelectUserGroupProps) => {
    const { values } = useFormikContext<Beleidskeuze | Maatregel>()
    const { data: userList } = useGebruikers()
    const [formattedUserList, setFormattedUserList] =
        useState<FormattedUserList>(initialState)
    const [dataLoaded, setDataLoaded] = useState(false)

    const filterAndFormatUserList = useCallback(
        (data: GebruikerInline[]) => {
            const meta = {
                Opdrachtgever: {
                    type: 'Ambtelijk opdrachtgever',
                    filter: null,
                },
                Eigenaar_1: {
                    type: 'Behandelend Ambtenaar',
                    filter: 'Eigenaar_2',
                },
                Eigenaar_2: {
                    type: 'Behandelend Ambtenaar',
                    filter: 'Eigenaar_1',
                },
                Portefeuillehouder_1: {
                    type: 'Portefeuillehouder',
                    filter: 'Portefeuillehouder_2',
                },
                Portefeuillehouder_2: {
                    type: 'Portefeuillehouder',
                    filter: 'Portefeuillehouder_1',
                },
            } as const

            const formattedUserList: FormattedUserList = initialState

            ;(
                Object.keys(formattedUserList) as Array<
                    keyof typeof formattedUserList
                >
            ).forEach(key => {
                const allowedUserType = meta[key].type
                const filterOutProperty = meta[key].filter
                const filterOutValue =
                    filterOutProperty === null
                        ? null
                        : values[filterOutProperty]

                formattedUserList[key] = data
                    // Filter out the correct user type
                    .filter(user => user.Rol === allowedUserType)
                    // We want to filter out already selected types
                    .filter(user =>
                        filterOutProperty !== null
                            ? user.UUID !== filterOutValue?.UUID
                            : true
                    )
                    // Format for the select options property
                    .map(user => ({
                        label: user.Gebruikersnaam || '',
                        value: user.UUID || '',
                    }))
            })

            return formattedUserList
        },
        [values]
    )

    useEffect(() => {
        if (!userList) return
        const formattedList = filterAndFormatUserList(userList)
        setFormattedUserList(formattedList)
        setDataLoaded(true)
    }, [values, userList, filterAndFormatUserList])

    return (
        <div
            className={classNames(className, {
                'cursor-not-allowed pointer-events-none opacity-50': disabled,
            })}>
            <span className="text-pzh-blue-dark bold">Personen</span>
            {dataLoaded ? (
                <>
                    <div className="w-1/2">
                        <div className="mr-2">
                            <span className="text-[0.8rem] leading-5">
                                Ambtelijk opdrachtgever
                            </span>
                            <FormikSelect
                                isClearable
                                testId="formik-select-opdrachtgever"
                                name="Opdrachtgever_UUID"
                                options={formattedUserList.Opdrachtgever}
                            />
                        </div>
                    </div>
                    <div className="flex mt-4">
                        <div className="w-full mr-2">
                            <span className="text-[0.8rem] leading-5">
                                Eerste eigenaar
                            </span>
                            <FormikSelect
                                isClearable
                                testId="formik-select-eigenaar-1"
                                name="Eigenaar_1_UUID"
                                options={formattedUserList.Eigenaar_1}
                            />
                        </div>
                        <div className="w-full ml-2">
                            <span className="text-[0.8rem] leading-5">
                                Tweede eigenaar
                            </span>
                            <FormikSelect
                                isClearable
                                testId="formik-select-eigenaar-2"
                                name="Eigenaar_2_UUID"
                                options={formattedUserList.Eigenaar_2}
                            />
                        </div>
                    </div>
                    <div className="flex mt-4">
                        <div className="w-full mr-2">
                            <span className="text-[0.8rem] leading-5">
                                Eerste portefeuillehouder
                            </span>
                            <FormikSelect
                                isClearable
                                testId="formik-select-portefeuillehouder-1"
                                name="Portefeuillehouder_1_UUID"
                                options={formattedUserList.Portefeuillehouder_1}
                            />
                        </div>
                        <div className="w-full ml-2">
                            <span className="text-[0.8rem] leading-5">
                                Tweede portefeuillehouder
                            </span>
                            <FormikSelect
                                isClearable
                                testId="formik-select-portefeuillehouder-2"
                                name="Portefeuillehouder_2_UUID"
                                options={formattedUserList.Portefeuillehouder_2}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="mt-4">
                    <div className="flex w-1/2">
                        <LoaderCard className="mr-2" />
                    </div>
                    <div className="flex">
                        <LoaderCard className="mr-2" />
                        <LoaderCard className="ml-2" />
                    </div>
                    <div className="flex">
                        <LoaderCard className="mr-2" />
                        <LoaderCard className="ml-2" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormikSelectUserGroup
