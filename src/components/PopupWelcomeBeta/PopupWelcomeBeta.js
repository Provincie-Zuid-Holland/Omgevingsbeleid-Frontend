import React from 'react'

const PopupWelcomeBeta = ({ closePopup }) => {
    return (
        <React.Fragment>
            <div className="absolute top-0 left-0 z-40 w-full h-full bg-gray-900 opacity-50"></div>
            <div className="absolute top-0 left-0 z-40 flex items-center justify-center w-full h-full">
                <div className="max-w-xl p-10 text-gray-700 bg-white rounded">
                    <div className="block mb-4">
                        <div className="w-full h-16 logo-main" />
                    </div>
                    <h2 className="mt-4 mb-2 text-lg font-bold">
                        Welkom op het vernieuwde Digitaal Omgevingsbeleid van
                        provincie Zuid-Holland!
                    </h2>
                    <p>
                        Net als in de oude omgeving kun je hier zoeken op
                        provinciaal beleid, maar ziet alles er net even anders
                        uit. Zo is er onder andere gewerkt aan een
                        gebruiksvriendelijkere omgeving en betere weergaven.
                        Omdat de website nog in ontwikkeling is kan het zijn dat
                        sommige functionaliteiten niet goed werken. Kom je een
                        fout tegen? Neem dan contact op door te mailen naar{' '}
                        <a
                            href="mailto:omgevingsbeleid@pzh.nl?subject=Feedback Omgevingsbeleid&body=Probeer zo duidelijk mogelijk te omschrijven waar je tegenaan liep"
                            className="underline cursor-pointer"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            omgevingsbeleid@pzh.nl
                        </a>
                    </p>
                    <span
                        onClick={closePopup}
                        id="aan-de-slag-close-popup"
                        className="block px-4 py-3 mt-8 text-sm font-bold leading-tight text-center text-white rounded cursor-pointer mbg-color hover:underline"
                    >
                        Aan de slag
                    </span>
                </div>
            </div>
        </React.Fragment>
    )
}

export default PopupWelcomeBeta
