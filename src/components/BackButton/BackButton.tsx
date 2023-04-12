import { ArrowLeft } from '@pzh-ui/icons'

import usePreviousPage from '@/hooks/usePreviousPage'

const BackButton = ({ className = '' }) => {
    const { back } = usePreviousPage()

    return (
        <button
            onClick={() => back()}
            className={`${className} text-pzh-blue-dark mb-4 inline-block`}>
            <ArrowLeft className="mr-2 -mt-0.5 inline-block" />
            <span>Terug</span>
        </button>
    )
}

export default BackButton
