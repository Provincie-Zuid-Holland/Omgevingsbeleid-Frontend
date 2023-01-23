import { GebruikerInline } from '@/api/fetchers.schemas'

import EigenaarsDriehoekItem from '../EigenaarsDriehoekItem'

/**
 * Displays a EigenaarsDriehoekItem component with the parameters based on the owner value inside the dataObject variable.
 *
 * @param {object} dataObject - Contains a collection of owners in object form.
 */

interface EigenaarsDriehoekProps {
    dataObject: {
        Opdrachtgever?: GebruikerInline
        Eigenaar_1?: GebruikerInline
        Eigenaar_2?: GebruikerInline
        Portefeuillehouder_1?: GebruikerInline
        Portefeuillehouder_2?: GebruikerInline
    }
}

const EigenaarsDriehoek = ({ dataObject }: EigenaarsDriehoekProps) => {
    if (
        !dataObject.Opdrachtgever &&
        !dataObject.Eigenaar_1 &&
        !dataObject.Eigenaar_2 &&
        !dataObject.Portefeuillehouder_1 &&
        !dataObject.Portefeuillehouder_2
    ) {
        return null
    }

    return (
        <>
            <div className="w-4/12">
                <h2 className="mb-2 text-gray-700">Eigenaarsdriehoek</h2>
                {dataObject.Eigenaar_1 ? (
                    <EigenaarsDriehoekItem
                        eigenaarType="Eerste eigenaar"
                        owner={dataObject.Eigenaar_1}
                    />
                ) : null}
                {dataObject.Eigenaar_2 ? (
                    <EigenaarsDriehoekItem
                        eigenaarType="Tweede eigenaar"
                        owner={dataObject.Eigenaar_2}
                    />
                ) : null}
                {dataObject.Opdrachtgever ? (
                    <EigenaarsDriehoekItem
                        eigenaarType="Ambtelijk opdrachtgever"
                        owner={dataObject.Opdrachtgever}
                    />
                ) : null}
                {dataObject.Portefeuillehouder_1 ? (
                    <EigenaarsDriehoekItem
                        eigenaarType="Eerste portefeuillehouder"
                        owner={dataObject.Portefeuillehouder_1}
                    />
                ) : null}
                {dataObject.Portefeuillehouder_2 ? (
                    <EigenaarsDriehoekItem
                        eigenaarType="Tweede portefeuillehouder"
                        owner={dataObject.Portefeuillehouder_2}
                    />
                ) : null}
            </div>
        </>
    )
}

export default EigenaarsDriehoek
