import React from "react"
import { faExpandAlt, faCompressAlt } from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import LeafletTinyViewer from "./../../../components/LeafletTinyViewer"

const Werkingsgebied = ({
    fullscreenLeafletViewer,
    setFullscreenLeafletViewer,
    werkingsGebiedUUID,
}) => {
    return (
        <div className="w-full mt-8" id="raadpleeg-detail-werkingsgebied">
            <div className="flex items-center justify-between pb-3">
                <h2 className="block mb-1 text-lg font-bold tracking-wide text-pzh-blue">
                    Werkingsgebied
                </h2>
                <span
                    className="px-2 text-xs cursor-pointer"
                    onClick={() =>
                        setFullscreenLeafletViewer(!fullscreenLeafletViewer)
                    }
                >
                    Bekijk in het {fullscreenLeafletViewer ? "klein" : "groot"}
                    <FontAwesomeIcon
                        className="ml-2 text-gray-700"
                        icon={
                            fullscreenLeafletViewer
                                ? faCompressAlt
                                : faExpandAlt
                        }
                    />
                </span>
            </div>

            <div
                className="overflow-hidden rounded-lg"
                id={`full-screen-leaflet-container-${fullscreenLeafletViewer}`}
            >
                <LeafletTinyViewer
                    gebiedType="Werkingsgebieden"
                    gebiedUUID={werkingsGebiedUUID}
                    fullscreen={fullscreenLeafletViewer}
                />
            </div>
        </div>
    )
}

export default Werkingsgebied
