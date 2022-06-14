import { Text } from '@pzh-ui/components'
import { AngleLeft } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'
export interface PageSpecificNavBarProps {
    text: string
    link: string
}

function PageSpecificNavBar({ text, link }: PageSpecificNavBarProps) {
    return (
        <div className="flex justify-between bg-pzh-gray-200">
            <div className="container flex items-center py-4 mx-auto sm:px-6 lg:px-8">
                <Link
                    to={link}
                    className="inline-flex items-center hover:underline">
                    <AngleLeft className="relative -mt-1" />
                    <Text className="ml-2">{text}</Text>
                </Link>
            </div>
        </div>
    )
}

export default PageSpecificNavBar
