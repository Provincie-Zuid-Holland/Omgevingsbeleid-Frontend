import {
    Accordion,
    BackLink,
    Button,
    Heading,
    Notification,
} from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { useEffect } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'

import {
    usePublicationEnvironmentsEnvironmentUuidGet,
    usePublicationsGet,
    usePublicationVersionsVersionUuidGet,
} from '@/api/fetchers'
import { DocumentType } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import {
    PublicationEditModal,
    PublicationVersionEditModal,
} from '@/components/Modals/PublicationModals'
import PublicationFolder from '@/components/Publications/PublicationFolder'
import PublicationPackages from '@/components/Publications/PublicationPackages'
import PublicationWizard from '@/components/Publications/PublicationWizard'
import usePublicationStore from '@/store/publicationStore'

const TabDecisions = () => (
    <div className="grid grid-cols-6 gap-x-10 gap-y-0 pt-6">
        <Outlet />
    </div>
)

export const Publications = () => {
    const { moduleId } = useParams()

    const wizardActive = usePublicationStore(state => state.wizardActive)
    const setWizardActive = usePublicationStore(state => state.setWizardActive)
    const activeFolders = usePublicationStore(state => state.activeFolders)
    const setActiveFolders = usePublicationStore(
        state => state.setActiveFolders
    )

    const documentTypes = Object.keys(DocumentType) as Array<DocumentType>

    const { data: publications, isFetching: publicationsFetching } =
        usePublicationsGet({
            module_id: parseInt(moduleId!),
            limit: 100,
        })

    useEffect(() => {
        if (!!publications?.results.length && !publicationsFetching) {
            setWizardActive(false)
        }
    }, [publications?.results, publicationsFetching, setWizardActive])

    return (
        <>
            <div className="col-span-6 flex flex-col gap-6">
                {publicationsFetching ? (
                    <LoaderSpinner />
                ) : !wizardActive ? (
                    <Button
                        size="small"
                        icon={Plus}
                        className="self-end"
                        onPress={() => setWizardActive(true)}>
                        Nieuw
                    </Button>
                ) : (
                    <PublicationWizard
                        handleClose={() => setWizardActive(false)}
                    />
                )}

                <Accordion
                    type="multiple"
                    className="flex flex-col gap-4"
                    value={activeFolders.documentTypes}
                    onValueChange={documentTypes =>
                        setActiveFolders({ documentTypes })
                    }>
                    {documentTypes.map(documentType => (
                        <PublicationFolder
                            key={documentType}
                            documentType={documentType}
                            publications={publications?.results}
                        />
                    ))}
                </Accordion>
            </div>

            <PublicationEditModal />
            <PublicationVersionEditModal />
        </>
    )
}

export const Packages = () => {
    const { moduleId, versionUUID } = useParams()

    const { data: version, isFetching: versionFetching } =
        usePublicationVersionsVersionUuidGet(String(versionUUID), {
            query: {
                enabled: !!versionUUID,
            },
        })

    const { data: environment, isFetching: environmentFetching } =
        usePublicationEnvironmentsEnvironmentUuidGet(
            String(version?.Publication.Environment_UUID),
            {
                query: {
                    enabled: !!version?.Publication.Environment_UUID,
                },
            }
        )

    if (versionFetching || environmentFetching || !version)
        return <LoaderSpinner />

    return (
        <div className="col-span-6 flex flex-col gap-6">
            <div>
                <BackLink
                    asChild
                    className="inline-flex text-s text-pzh-blue-500 underline hover:no-underline">
                    <Link to={`/muteer/modules/${moduleId}/besluiten`}>
                        Terug naar het overzicht
                    </Link>
                </BackLink>
            </div>

            <Heading level="2" size="l">
                {version?.Module_Status.Status} - {version?.Publication.Title} (
                {environment?.Title})
            </Heading>

            <Notification
                title="Let op! Een versie kan niet worden bewerkt of verwijderd nadat je op ‘Maak levering’ hebt geklikt."
                className="w-full"
            />

            <Accordion
                type="multiple"
                className="flex flex-col gap-4"
                defaultValue={['act']}
                value={
                    !environment?.Can_Publicate ||
                    version?.Publication.Procedure_Type !== 'draft'
                        ? ['act']
                        : undefined
                }>
                <PublicationPackages
                    version={version}
                    publication={version?.Publication}
                    publicationType="act"
                />
                {version?.Publication.Procedure_Type === 'draft' &&
                    environment?.Can_Publicate && (
                        <PublicationPackages
                            version={version}
                            publication={version?.Publication}
                            publicationType="announcement"
                        />
                    )}
            </Accordion>
        </div>
    )
}

export default TabDecisions
