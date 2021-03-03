import React from 'react'

import EigenaarsDriehoekItem from './../EigenaarsDriehoekItem'

/**
 * Component that renders a EigenaarsDriehoekItem component depending on if the dataObject contains the certain owner.
 *
 * @component
 *
 * @param {object} dataObject - Parameter that contains a collection of owners and each owner is used for conditional statements within the component to show/hide the EigenaarsDriehoekItem component based on value.
 */
const EigenaarsDriehoek = ({ dataObject }) => {
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
            <div className="w-3/12">
                <h2 className="mb-2 font-serif text-gray-700">
                    Eigenaarsdriehoek
                </h2>
                {dataObject.Eigenaar_1 ? (
                    <EigenaarsDriehoekItem
                        eigenaarType="Eerste eigenaar"
                        UUID={dataObject.Eigenaar_1}
                    />
                ) : null}
                {dataObject.Eigenaar_2 ? (
                    <EigenaarsDriehoekItem
                        eigenaarType="Tweede eigenaar"
                        UUID={dataObject.Eigenaar_2}
                    />
                ) : null}
                {dataObject.Opdrachtgever ? (
                    <EigenaarsDriehoekItem
                        eigenaarType="Ambtelijk opdrachtgever"
                        UUID={dataObject.Opdrachtgever}
                    />
                ) : null}
                {dataObject.Portefeuillehouder_1 ? (
                    <EigenaarsDriehoekItem
                        eigenaarType="Eerste portefeuillehouder"
                        UUID={dataObject.Portefeuillehouder_1}
                    />
                ) : null}
                {dataObject.Portefeuillehouder_2 ? (
                    <EigenaarsDriehoekItem
                        eigenaarType="Tweede portefeuillehouder"
                        UUID={dataObject.Portefeuillehouder_2}
                    />
                ) : null}
            </div>
        </>
    )
}

export default EigenaarsDriehoek
