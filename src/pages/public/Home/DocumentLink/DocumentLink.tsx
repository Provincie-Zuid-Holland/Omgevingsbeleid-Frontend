import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Text from '@/components/Text'

interface DocumentLinkProps {
    href: string
    title: string
    iconLeft: IconProp
    className?: string
}

const DocumentLink = ({
    href,
    title,
    iconLeft,
    className = '',
}: DocumentLinkProps) => (
    <li
        className={`pb-2 transition-colors duration-100 ease-in text-pzh-green ${className}`}>
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between">
            <div className="flex">
                <span className="flex items-center">
                    <FontAwesomeIcon icon={iconLeft} />
                </span>
                <Text
                    color="text-pzh-green hover:text-pzh-green-dark"
                    className="ml-2 underline"
                    type="body">
                    {title}
                </Text>
            </div>
        </a>
    </li>
)

export default DocumentLink
