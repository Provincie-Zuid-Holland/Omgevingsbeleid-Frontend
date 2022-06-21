import { faInfoCircle } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

import getDimensionsConstants from '@/utils/getDimensionsConstants'

interface RaadpleegObjectDetailNewVersionNotificationProps {
    dataObject?: any
    titleSingular: string
}

function RaadpleegObjectDetailNewVersionNotification({
    dataObject,
    titleSingular,
}: RaadpleegObjectDetailNewVersionNotificationProps) {
    if (titleSingular !== 'Maatregel' && titleSingular !== 'Beleidskeuze')
        return null

    const beleidskeuzeConstants = getDimensionsConstants('beleidskeuzes')
    const maatregelConstants = getDimensionsConstants('maatregelen')

    const objectSlug =
        titleSingular === beleidskeuzeConstants.TITLE_SINGULAR
            ? beleidskeuzeConstants.SLUG_OVERVIEW
            : maatregelConstants.SLUG_OVERVIEW

    const { Status, UUID, Latest_Version, Latest_Status, Effective_Version } =
        dataObject

    const unpublicStatusses = [
        'Ontwerp GS Concept',
        'Definitief ontwerp GS concept',
    ]

    // Current policy is from a lineage without a valid version
    const isNewWithNoEffectiveVersionPresent =
        Status !== 'Vigerend' && Effective_Version === null

    // Current policy is from a lineage with a valid version, but is not valid itself
    const isNewWithEffectiveVersionPresent =
        Status !== 'Vigerend' && Effective_Version !== null

    // Current policy is valid and has a newer valid version which has no checked out concept versions
    const isValidAndArchived =
        Status === 'Vigerend' &&
        UUID !== Effective_Version &&
        Latest_Status === 'Vigerend' &&
        Latest_Version === Effective_Version

    // Current policy is valid and has a newer valid version which has a new concept version that is public
    const isValidButNewPublicDraftAvailable =
        Status === 'Vigerend' &&
        UUID === Effective_Version &&
        Latest_Status !== 'Vigerend' &&
        !unpublicStatusses.includes(Latest_Status)

    // Current policy is valid and has a newer valid version which has a new concept version that is public
    const isValidButNewPublicDraftWithStatusInInspraakAvailable =
        Status === 'Vigerend' &&
        UUID === Effective_Version &&
        Latest_Status === 'Ontwerp in inspraak'

    // Current policy is valid and has a newer valid version which has a new concept version that is public
    const isValidButNewPublicDraftWithStatusVastgesteldAvailable =
        Status === 'Vigerend' &&
        UUID === Effective_Version &&
        Latest_Status === 'Vastgesteld'

    // Current policy is valid and has a newer valid version which has one or more checked out concept versions that is not public
    const isValidButNewNonPublicDraftAvailable =
        Status === 'Vigerend' &&
        UUID === Effective_Version &&
        Latest_Status !== 'Vigerend' &&
        unpublicStatusses.includes(Latest_Status)

    const isValidWithNoNewerVersionsAvailable =
        UUID === Effective_Version &&
        Effective_Version === Latest_Version &&
        Latest_Status === 'Vigerend'

    if (
        isValidWithNoNewerVersionsAvailable ||
        (!isNewWithNoEffectiveVersionPresent &&
            !isNewWithEffectiveVersionPresent &&
            !isValidAndArchived &&
            !isValidButNewPublicDraftAvailable &&
            !isValidButNewNonPublicDraftAvailable &&
            !isValidButNewPublicDraftWithStatusInInspraakAvailable &&
            !isValidButNewPublicDraftWithStatusVastgesteldAvailable)
    )
        return null

    return (
        <div className="flex w-full px-3 pt-5 pb-4 mt-4 bg-pzh-blue-light bg-opacity-20 text-pzh-blue-dark">
            <div className="pl-2 pr-4">
                <FontAwesomeIcon icon={faInfoCircle} className="text-lg" />
            </div>
            {isNewWithNoEffectiveVersionPresent ? (
                <span>
                    Op dit moment is dit beleid nog niet vigerend en nog in
                    ontwerp
                </span>
            ) : isValidButNewPublicDraftWithStatusInInspraakAvailable ? (
                <span>
                    Op dit moment ligt er een nieuwe versie van deze{' '}
                    {titleSingular.toLowerCase()} ter inzage,{' '}
                    <Link
                        className="underline"
                        to={`/${objectSlug}/${Latest_Version}`}>
                        bekijk deze versie hier
                    </Link>
                </span>
            ) : isValidButNewPublicDraftWithStatusVastgesteldAvailable ? (
                <span>
                    Er is een nieuwe versie van deze{' '}
                    {titleSingular.toLowerCase()} vastgesteld,{' '}
                    <Link
                        className="underline"
                        to={`/${objectSlug}/${Latest_Version}`}>
                        bekijk deze versie hier
                    </Link>
                </span>
            ) : isNewWithEffectiveVersionPresent ? (
                <span>
                    Let op! Deze versie is nog niet vigerend,{' '}
                    <Link
                        className="underline"
                        to={`/${objectSlug}/${Effective_Version}`}>
                        bekijk hier de vigerende versie
                    </Link>
                </span>
            ) : isValidAndArchived ? (
                <span>
                    Let op, dit is een verouderde versie van deze{' '}
                    {titleSingular.toLowerCase()},{' '}
                    <Link
                        className="underline"
                        to={`/${objectSlug}/${Effective_Version}`}>
                        bekijk hier de vigerende versie
                    </Link>
                </span>
            ) : isValidButNewPublicDraftAvailable ? (
                <span>
                    Op dit moment wordt er gewerkt aan een nieuwe versie van
                    deze {titleSingular.toLowerCase()},{' '}
                    <Link
                        className="underline"
                        to={`/${objectSlug}/${Latest_Version}`}>
                        bekijk hier de meest actuele versie.
                    </Link>
                </span>
            ) : isValidButNewNonPublicDraftAvailable ? (
                <span>
                    Op dit moment wordt er gewerkt aan een nieuwe versie van
                    deze beleidskeuze. Zodra deze versie openbaar wordt, is hij
                    hier terug te vinden.
                </span>
            ) : null}
        </div>
    )
}

export default RaadpleegObjectDetailNewVersionNotification
