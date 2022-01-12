import { faExternalLinkAlt } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ViewFieldExternalURL = ({ externalURL }) => {
    if (!externalURL) return null

    // https://stackoverflow.com/questions/43803778/href-without-https-prefix
    const getClickableLink = link => {
        return link.startsWith('http://') || link.startsWith('https://')
            ? link
            : `//${link}`
    }

    return (
        <a
            href={getClickableLink(externalURL)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 text-pzh-blue hover:text-pzh-blue-dark"
        >
            <span className="underline">Bekijk officiële publicatie</span>
            <FontAwesomeIcon
                className="relative ml-2"
                icon={faExternalLinkAlt}
            />
        </a>
    )
}

export default ViewFieldExternalURL
