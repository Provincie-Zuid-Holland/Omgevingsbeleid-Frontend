import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import axios from './../../API/axios'
import FormFieldSelectUser from './../FormFieldSelectUser'
import LoaderSelect from './../LoaderSelect'

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
const FormFieldSelectUserGroup = ({
    crudObject,
    editStatus,
    handleChange,
    titleSingular,
    disabled,
}) => {
    const [gebruikersLijst, setGebruikersLijst] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        axios
            .get('gebruikers')
            .then(res => {
                const objecten = res.data
                setGebruikersLijst(objecten)
                setDataLoaded(true)
            })
            .catch(err => {
                setDataLoaded(true)
                setError(true)
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }, [])

    return (
        <>
            <span className="block mb-2 text-sm font-bold tracking-wide text-gray-700">
                Personen
            </span>
            <div className="flex w-1/2">
                {dataLoaded && !error ? (
                    <FormFieldSelectUser
                        disabled={disabled}
                        editStatus={editStatus}
                        halfWidth={true}
                        handleChange={handleChange}
                        fieldValue={crudObject['Opdrachtgever']}
                        dataObjectProperty="Opdrachtgever"
                        gebruikersLijst={gebruikersLijst}
                        filter={'Ambtelijk opdrachtgever'}
                        pValue="Ambtelijk opdrachtgever"
                        titleSingular={titleSingular}
                    />
                ) : (
                    <LoaderSelect />
                )}
            </div>

            <div className="flex">
                {dataLoaded && !error ? (
                    <FormFieldSelectUser
                        disabled={disabled}
                        editStatus={editStatus}
                        handleChange={handleChange}
                        gebruikersLijst={gebruikersLijst}
                        fieldValue={crudObject['Eigenaar_1']}
                        dataObjectProperty="Eigenaar_1"
                        marginRight={true}
                        filter={'Behandelend Ambtenaar'}
                        filterOtherProperty={crudObject['Eigenaar_2']}
                        pValue="Eerste eigenaar"
                        titleSingular={titleSingular}
                    />
                ) : (
                    <LoaderSelect />
                )}

                {dataLoaded && !error ? (
                    <FormFieldSelectUser
                        disabled={disabled}
                        editStatus={editStatus}
                        handleChange={handleChange}
                        gebruikersLijst={gebruikersLijst}
                        fieldValue={crudObject['Eigenaar_2']}
                        dataObjectProperty="Eigenaar_2"
                        filter={'Behandelend Ambtenaar'}
                        filterOtherProperty={crudObject['Eigenaar_1']}
                        pValue="Tweede eigenaar"
                        titleSingular={titleSingular}
                    />
                ) : (
                    <LoaderSelect />
                )}
            </div>

            <div className="flex">
                {dataLoaded && !error ? (
                    <FormFieldSelectUser
                        disabled={disabled}
                        editStatus={editStatus}
                        handleChange={handleChange}
                        filter={'Portefeuillehouder'}
                        filterOtherProperty={crudObject['Portefeuillehouder_2']}
                        gebruikersLijst={gebruikersLijst}
                        fieldValue={crudObject['Portefeuillehouder_1']}
                        dataObjectProperty="Portefeuillehouder_1"
                        marginRight={true}
                        pValue="Eerste portefeuillehouder"
                        titleSingular={titleSingular}
                    />
                ) : (
                    <LoaderSelect />
                )}

                {dataLoaded && !error ? (
                    <FormFieldSelectUser
                        disabled={disabled}
                        editStatus={editStatus}
                        gebruikersLijst={gebruikersLijst}
                        filter={'Portefeuillehouder'}
                        filterOtherProperty={crudObject['Portefeuillehouder_1']}
                        handleChange={handleChange}
                        fieldValue={crudObject['Portefeuillehouder_2']}
                        dataObjectProperty="Portefeuillehouder_2"
                        pValue="Tweede portefeuillehouder"
                        titleSingular={titleSingular}
                    />
                ) : (
                    <LoaderSelect />
                )}
            </div>
        </>
    )
}

export default FormFieldSelectUserGroup
