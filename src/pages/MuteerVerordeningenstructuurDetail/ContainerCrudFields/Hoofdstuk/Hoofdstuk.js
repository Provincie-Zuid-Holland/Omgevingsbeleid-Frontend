import React from 'react'

import SelectField from '../SelectField'
import Werkingsgebied from '../Werkingsgebied'

import FormFieldWerkingsgebiedKoppeling from '../../../../components/FormFieldWerkingsgebiedKoppeling'

function Hoofdstuk({
    users,
    verordeningsObjectFromGET,
    setVerordeningsObjectFromGET,
}) {
    return (
        <div className="flex-grow inline-block w-full">
            <form className="mt-2">
                <div>
                    <SelectField
                        users={users}
                        label={'Opdrachtgever'}
                        property={'Opdrachtgever'}
                        filter={'Ambtelijk opdrachtgever'}
                        setVerordeningsObjectFromGET={
                            setVerordeningsObjectFromGET
                        }
                        verordeningsObjectFromGET={verordeningsObjectFromGET}
                    />
                    <SelectField
                        users={users}
                        label={'Eerste eigenaar'}
                        property={'Eigenaar_1'}
                        filter={'Beleidseigenaar'}
                        setVerordeningsObjectFromGET={
                            setVerordeningsObjectFromGET
                        }
                        verordeningsObjectFromGET={verordeningsObjectFromGET}
                    />
                    <SelectField
                        users={users}
                        label={'Tweede eigenaar'}
                        property={'Eigenaar_2'}
                        filter={'Beleidseigenaar'}
                        setVerordeningsObjectFromGET={
                            setVerordeningsObjectFromGET
                        }
                        verordeningsObjectFromGET={verordeningsObjectFromGET}
                    />
                    <SelectField
                        users={users}
                        label={'Eerste portefeuillehouder'}
                        property={'Portefeuillehouder_1'}
                        filter={'Portefeuillehouder'}
                        setVerordeningsObjectFromGET={
                            setVerordeningsObjectFromGET
                        }
                        verordeningsObjectFromGET={verordeningsObjectFromGET}
                    />
                    <SelectField
                        users={users}
                        label={'Tweede portefeuillehouder'}
                        property={'Portefeuillehouder_2'}
                        filter={'Portefeuillehouder'}
                        setVerordeningsObjectFromGET={
                            setVerordeningsObjectFromGET
                        }
                        verordeningsObjectFromGET={verordeningsObjectFromGET}
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="Begin_Geldigheid"
                        className="block text-sm font-medium leading-5 text-gray-700"
                    >
                        Datum inwerkingtreding
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                            placeholder="dd-mm-jjjj"
                            type="date"
                            value={
                                verordeningsObjectFromGET['Begin_Geldigheid']
                            }
                            onChange={(e) => {
                                setVerordeningsObjectFromGET({
                                    type: 'changeValue',
                                    value: e.target.value,
                                    name: 'Begin_Geldigheid',
                                })
                            }}
                            id="Begin_Geldigheid"
                            className="block w-full form-input sm:text-sm sm:leading-5"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="Eind_Geldigheid"
                        className="block text-sm font-medium leading-5 text-gray-700"
                    >
                        Datum uitwerkingtreding
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                            placeholder="dd-mm-jjjj"
                            type="date"
                            value={verordeningsObjectFromGET.Eind_Geldigheid}
                            onChange={(e) => {
                                setVerordeningsObjectFromGET({
                                    type: 'changeValue',
                                    value: e.target.value,
                                    name: 'Eind_Geldigheid',
                                })
                            }}
                            id="Eind_Geldigheid"
                            className="block w-full form-input sm:text-sm sm:leading-5"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="Eind_Geldigheid"
                        className="block text-sm font-medium leading-5 text-gray-700"
                    >
                        Werkingsgebied
                    </label>
                    <Werkingsgebied
                        setVerordeningsObjectFromGET={
                            setVerordeningsObjectFromGET
                        }
                        verordeningsObjectFromGET={verordeningsObjectFromGET}
                    />
                </div>
            </form>
        </div>
    )
}

export default Hoofdstuk
