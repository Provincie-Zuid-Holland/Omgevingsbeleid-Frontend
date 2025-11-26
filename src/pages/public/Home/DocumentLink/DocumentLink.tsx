import { Hyperlink } from '@pzh-ui/components'

interface DocumentLinkProps {
    href: string
    title: string
    icon?: any
    className?: string
}

const DocumentLink = ({ href, title, icon: Icon }: DocumentLinkProps) => (
    <li>
        <Hyperlink asChild>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2">
                {Icon && (
                    <Icon
                        size={18}
                        className="-mt-1"
                        aria-label="opent een nieuwe browsertab"
                    />
                )}
                {title}
            </a>
        </Hyperlink>
    </li>
)

export default DocumentLink
