import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import usePreviousPage from '@/hooks/usePreviousPage'

const BackButton = ({ className = '' }) => {
    const { back } = usePreviousPage()

    return (
        <button
            onClick={() => back()}
            className={`${className} text-pzh-blue cursor-pointer opacity-75 hover:opacity-100 transition-opacity ease-in duration-100 mb-4 inline-block`}>
            <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
            <span>Terug</span>
        </button>
    )
}

export default BackButton
