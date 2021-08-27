import React from "react"

/**
 * Displays the props.titel, props.beschrijving and props.children values within it.
 *
 * @class
 * @extends React.Component
 */
class ContainerFormSection extends React.Component {
    render() {
        if (this.props.hide) return null
        return (
            <div className="flex pb-8 mb-8 border-b-2 border-gray-300">
                <div className="w-1/3 pr-20">
                    <h2 className="mb-2 text-lg font-bold text-pzh-blue">
                        {/* Algemene informatie */}
                        {this.props.titel}
                    </h2>
                    <p className="text-sm text-gray-700">
                        {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  */}
                        {this.props.beschrijving}
                    </p>
                </div>
                <div className="w-2/3">{this.props.children}</div>
            </div>
        )
    }
}

export default ContainerFormSection
