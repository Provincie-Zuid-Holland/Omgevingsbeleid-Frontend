import React from 'react';

import { faSlidersH } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function KnopIconSliderSettings(props) {
    return(

        <div onClick={props.toggleOpen} className="appearance-none block bg-white text-gray-700 cursor-pointer border border-gray-300 rounded leading-tight focus:outline-none hover:border-gray-400 focus:border-gray-400 text-lg settings-icon">
            <FontAwesomeIcon icon={faSlidersH} className="absolute text-sm" />
        </div>

    )
}

export default KnopIconSliderSettings