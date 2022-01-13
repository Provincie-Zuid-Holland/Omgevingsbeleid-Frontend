import { useLockBodyScroll } from 'react-use'

import logoSVG from './../../../images/PZH_Basislogo.svg'

/**
 * Displays a popup with a welcome text and a close button.
 */

interface PopupProps {
    closePopup: () => void
}

const PopupWelcomeBeta = ({ closePopup }: PopupProps) => {
    useLockBodyScroll(true)

    return (
        <>
            <div className="absolute top-0 left-0 z-40 w-screen h-screen bg-gray-900 opacity-50"></div>
            <div className="absolute top-0 left-0 z-40 flex items-center justify-center w-screen h-screen">
                <div className="max-w-xl p-10 pt-5 text-gray-700 bg-white rounded">
                    <div className="block w-full mb-4 text-center">
                        <img
                            className="inline-block"
                            style={{ height: '136px' }}
                            src={logoSVG}
                            alt="Provincie Zuid-Holland Logo"
                        />
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
                            rel="noopener noreferrer">
                            omgevingsbeleid@pzh.nl
                        </a>
                    </p>
                    <span
                        onClick={closePopup}
                        id="aan-de-slag-close-popup"
                        className="block px-4 py-3 mt-8 text-sm font-bold leading-tight text-center text-white rounded cursor-pointer bg-pzh-blue hover:underline">
                        Aan de slag
                    </span>
                </div>
            </div>
        </>
    )
}

export default PopupWelcomeBeta