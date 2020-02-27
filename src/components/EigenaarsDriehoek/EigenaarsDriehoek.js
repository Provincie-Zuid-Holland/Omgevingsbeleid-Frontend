import React, { Component } from 'react'

import EigenaarsDriehoekItem from './../EigenaarsDriehoekItem'

class EigenaarsDriehoek extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="w-3/12">
                    <h2 className="mb-2 font-serif text-gray-700">
                        Eigenaarsdriehoek
                    </h2>
                    {this.props.dataObject.Opdrachtgever !== null &&
                    this.props.dataObject.Opdrachtgever !== undefined ? (
                        <EigenaarsDriehoekItem
                            eigenaarType="Ambtelijk opdrachtgever"
                            UUID={this.props.dataObject.Opdrachtgever}
                        />
                    ) : null}
                    {this.props.dataObject.Eigenaar_1 !== null &&
                    this.props.dataObject.Eigenaar_1 !== undefined ? (
                        <EigenaarsDriehoekItem
                            eigenaarType="Eigenaar 1"
                            UUID={this.props.dataObject.Eigenaar_1}
                        />
                    ) : null}
                    {this.props.dataObject.Eigenaar_2 !== null &&
                    this.props.dataObject.Eigenaar_2 !== undefined ? (
                        <EigenaarsDriehoekItem
                            eigenaarType="Eigenaar 2"
                            UUID={this.props.dataObject.Eigenaar_2}
                        />
                    ) : null}
                    {this.props.dataObject.Portefeuillehouder_1 !== null &&
                    this.props.dataObject.Portefeuillehouder_1 !== undefined ? (
                        <EigenaarsDriehoekItem
                            eigenaarType="Portefeuillehouder 1"
                            UUID={this.props.dataObject.Portefeuillehouder_1}
                        />
                    ) : null}
                    {this.props.dataObject.Portefeuillehouder_2 !== null &&
                    this.props.dataObject.Portefeuillehouder_2 !== undefined ? (
                        <EigenaarsDriehoekItem
                            eigenaarType="Portefeuillehouder 2"
                            UUID={this.props.dataObject.Portefeuillehouder_2}
                        />
                    ) : null}
                </div>
            </React.Fragment>
        )
    }
}

export default EigenaarsDriehoek
