import React from 'react'

import EigenaarsDriehoekItem from './../EigenaarsDriehoekItem'

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
        <React.Fragment>
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
        </React.Fragment>
    )
}

export default EigenaarsDriehoek
