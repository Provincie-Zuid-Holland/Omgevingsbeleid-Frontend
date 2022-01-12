/* istanbul ignore file */

import SelectField from './../SelectField'
import Werkingsgebied from './../Werkingsgebied'

function Artikel({
    users,
    verordeningsObjectFromGET,
    setVerordeningsObjectFromGET,
    setVerordeningsLedenFromGET,
    inheritWerkingsgebiedenFromArtikel,
    setInheritWerkingsgebiedenFromArtikel,
    hasLeden,
}) {
    if (!verordeningsObjectFromGET) {
        return null
    }

    const setWerkingsgebied =
        hasLeden && inheritWerkingsgebiedenFromArtikel
            ? UUID => {
                  setVerordeningsObjectFromGET({
                      type: 'changeValue',
                      value: UUID,
                      name: 'Gebied',
                  })
                  setVerordeningsLedenFromGET({
                      type: 'changeValueForAllLeden',
                      value: UUID,
                      name: 'Gebied',
                  })
              }
            : UUID =>
                  setVerordeningsObjectFromGET({
                      type: 'changeValue',
                      value: UUID,
                      name: 'Gebied',
                  })

    /**
     * The standard dates are created in the back-end
     * To keep the UI clean we return an empty string
     */
    const getDateValue = value => {
        const standardDates = ['1753-01-01', '10000-01-01']
        if (standardDates.includes(value)) return ''
        return value
    }

    return (
        <div className="flex-grow inline-block w-full">
            <form className="mt-2">
                <div>
                    <SelectField
                        users={users}
                        label={'Eerste eigenaar'}
                        property={'Eigenaar_1'}
                        filter={['Beleidseigenaar', 'Behandelend Ambtenaar']}
                        excludeValue={'Eigenaar_2'}
                        setVerordeningsObjectFromGET={
                            setVerordeningsObjectFromGET
                        }
                        verordeningsObjectFromGET={verordeningsObjectFromGET}
                    />
                    <SelectField
                        users={users}
                        label={'Tweede eigenaar'}
                        property={'Eigenaar_2'}
                        excludeValue={'Eigenaar_1'}
                        filter={['Beleidseigenaar', 'Behandelend Ambtenaar']}
                        setVerordeningsObjectFromGET={
                            setVerordeningsObjectFromGET
                        }
                        verordeningsObjectFromGET={verordeningsObjectFromGET}
                    />
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
                        label={'Eerste portefeuillehouder'}
                        property={'Portefeuillehouder_1'}
                        excludeValue={'Portefeuillehouder_2'}
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
                        excludeValue={'Portefeuillehouder_1'}
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
                        className="block text-sm font-medium leading-5 text-gray-700">
                        Datum inwerkingtreding
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                            placeholder="dd-mm-jjjj"
                            type="date"
                            value={getDateValue(
                                verordeningsObjectFromGET['Begin_Geldigheid']
                            )}
                            onChange={e => {
                                setVerordeningsObjectFromGET({
                                    type: 'changeValue',
                                    value: e.target.value,
                                    name: 'Begin_Geldigheid',
                                })
                            }}
                            id="Begin_Geldigheid"
                            className="block w-full form-input "
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="Eind_Geldigheid"
                        className="block text-sm font-medium leading-5 text-gray-700">
                        Datum uitwerkingtreding
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                            placeholder="dd-mm-jjjj"
                            type="date"
                            value={getDateValue(
                                verordeningsObjectFromGET.Eind_Geldigheid
                            )}
                            onChange={e => {
                                setVerordeningsObjectFromGET({
                                    type: 'changeValue',
                                    value: e.target.value,
                                    name: 'Eind_Geldigheid',
                                })
                            }}
                            id="Eind_Geldigheid"
                            className="block w-full form-input "
                        />
                    </div>
                </div>
                <div className="mb-4">
                    {hasLeden && !inheritWerkingsgebiedenFromArtikel ? null : (
                        <>
                            <label
                                htmlFor="Eind_Geldigheid"
                                className="block text-sm font-medium leading-5 text-gray-700">
                                Werkingsgebied
                            </label>
                            <Werkingsgebied
                                werkingsgebiedInParentState={
                                    verordeningsObjectFromGET
                                        ? verordeningsObjectFromGET.Gebied
                                        : null
                                }
                                setWerkingsgebiedInParentState={
                                    setWerkingsgebied
                                }
                            />
                        </>
                    )}
                    {hasLeden ? (
                        <div className="mt-2">
                            <input
                                id="inherit-werkingsgebieden-from-artikel"
                                type="checkbox"
                                className="text-theme-green"
                                checked={inheritWerkingsgebiedenFromArtikel}
                                onChange={() => {
                                    if (!inheritWerkingsgebiedenFromArtikel) {
                                        // User ticks the checkbox
                                        // Remove werkingsgebieden from each lid
                                        setVerordeningsLedenFromGET({
                                            type: 'resetAllWerkingsgebieden',
                                        })
                                    } else {
                                        // User unticks the checkbox
                                        setVerordeningsLedenFromGET({
                                            type: 'setValueForAll',
                                            value: verordeningsObjectFromGET.Gebied,
                                        })
                                        setVerordeningsObjectFromGET({
                                            type: 'changeValue',
                                            name: 'Gebied',
                                            value: null,
                                        })
                                    }
                                    setInheritWerkingsgebiedenFromArtikel(
                                        !inheritWerkingsgebiedenFromArtikel
                                    )
                                }}
                            />
                            <label
                                className="ml-2 text-sm text-gray-700 cursor-pointer"
                                htmlFor="inherit-werkingsgebieden-from-artikel">
                                Alle leden van dit artikel gaan over hetzelfde
                                werkingsgebied
                            </label>
                        </div>
                    ) : null}
                </div>
            </form>
        </div>
    )
}

export default Artikel
