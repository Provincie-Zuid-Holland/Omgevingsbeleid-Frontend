import { ArrowLeft } from '@pzh-ui/icons'

import usePreviousPage from '@/hooks/usePreviousPage'

const BackButton = ({ className = '' }) => {
    const { back } = usePreviousPage()

    return (
        <div
            onClick={() => back()}
            className={`${className} text-pzh-blue cursor-pointer opacity-75 hover:opacity-100 transition-opacity ease-in duration-100 mb-4 inline-block`}>
            <ArrowLeft className="mr-2 -mt-0.5 inline-block" />
            <span>Terug</span>
        </div>
    )
}

export default BackButton
