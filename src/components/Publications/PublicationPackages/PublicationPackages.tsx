import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Button,
    Notification,
    Text,
    formatDate,
} from '@pzh-ui/components'
import { useMemo } from 'react'

import {
    usePublicationActPackagesActPackageUuidCreateAnnouncementPost,
    usePublicationActPackagesGet,
    usePublicationAnnouncementsGet,
    usePublicationVersionsVersionUuidGet,
} from '@/api/fetchers'
import {
    PackageType,
    ProcedureType,
    PublicationEnvironment,
    PublicationVersionShort,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import { ModalStateMap } from '@/components/Modals/types'
import useModalStore from '@/store/modalStore'

import PublicationAnnouncement from '../PublicationAnnouncement'
import { PackageStep, PackageStepActions } from './components'

export interface PublicationPackageProps {
    type: 'create' | 'download' | 'upload'
    eventType: PackageType
}

interface PublicationPackagesProps extends PublicationVersionShort {
    environment?: PublicationEnvironment
    procedureType: string
    handleUpdateAction: () => void
}

const PublicationPackages = ({
    environment,
    procedureType,
    handleUpdateAction,
    ...version
}: PublicationPackagesProps) => {
    const modalState = useModalStore(
        state => state.modalStates['publicationPackages']
    ) as ModalStateMap['publicationPackages']
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data } = usePublicationVersionsVersionUuidGet(version.UUID)

    const { data: packages, isPending } = usePublicationActPackagesGet({
        version_uuid: version.UUID,
    })

    const { validationPackage, publicationPackage } = useMemo(() => {
        const validationPackage = packages?.results.find(
            pkg => pkg.Package_Type === PackageType['validation']
        )
        const publicationPackage = packages?.results.find(
            pkg => pkg.Package_Type === PackageType['publication']
        )

        return { validationPackage, publicationPackage }
    }, [packages?.results])

    const { mutate: createAnnouncement } =
        usePublicationActPackagesActPackageUuidCreateAnnouncementPost({
            mutation: {
                onSuccess: data =>
                    setActiveModal('publicationAnnouncementPackages', {
                        environment,
                        version,
                        announcementUuid: data.UUID,
                    }),
            },
        })

    const { data: announcement } = usePublicationAnnouncementsGet(
        { act_package_uuid: publicationPackage?.UUID },
        {
            query: {
                enabled: publicationPackage?.Report_Status === 'valid',
                select: data => data.results[0],
            },
        }
    )

    const { announcementDate, effectiveDate } = useMemo(() => {
        const announcementDate =
            data?.Announcement_Date &&
            formatDate(new Date(data.Announcement_Date), 'd LLLL yyyy')

        const effectiveDate =
            data?.Effective_Date &&
            formatDate(new Date(data.Effective_Date), 'd LLLL yyyy')

        return { announcementDate, effectiveDate }
    }, [data])

    const isOfficial = useMemo(
        () => environment?.Can_Publicate,
        [environment?.Can_Publicate]
    )

    if (isPending) {
        return (
            <div className="my-10 flex justify-center">
                <LoaderSpinner />
            </div>
        )
    }

    return (
        <Accordion
            type="multiple"
            defaultValue={
                validationPackage?.Report_Status !== 'valid'
                    ? ['item-1']
                    : isOfficial &&
                      validationPackage?.Report_Status === 'valid' &&
                      !!!announcement
                    ? ['item-2']
                    : undefined
            }>
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <Text size="m" bold color="text-pzh-blue-500">
                        {isOfficial ? 'Validatie' : 'Publicatie'}
                    </Text>
                </AccordionTrigger>
                <AccordionContent>
                    <PackageStep
                        version={version}
                        type="create"
                        eventType="validation"
                        isActive={!!!validationPackage}
                        isSucceeded={!!validationPackage}
                        isFirst
                    />
                    <PackageStep
                        version={version}
                        type="download"
                        eventType="validation"
                        isActive={!!validationPackage}
                        isLast={!isOfficial}
                        isSucceeded={
                            !!validationPackage?.Zip.Latest_Download_Date
                        }
                    />
                    {isOfficial && (
                        <PackageStep
                            version={version}
                            type="upload"
                            eventType="validation"
                            isActive={
                                !!validationPackage?.Zip.Latest_Download_Date
                            }
                            isSucceeded={
                                validationPackage?.Report_Status === 'valid'
                            }
                            isLast
                        />
                    )}

                    {isOfficial &&
                        validationPackage?.Report_Status === 'valid' &&
                        !!!publicationPackage && (
                            <Notification
                                variant="positive"
                                title="Validatie gelukt."
                                className="my-6 w-full"
                            />
                        )}

                    {isOfficial &&
                        validationPackage?.Report_Status === 'failed' &&
                        !!!publicationPackage && (
                            <div className="my-6 flex w-full justify-between gap-4">
                                <Notification
                                    variant="negative"
                                    title="Validatie niet goedgekeurd. Publicatie is niet mogelijk, bewerk de versie en probeer het opnieuw."
                                    className="w-full"
                                />
                                <PackageStepActions
                                    version={version}
                                    type="create"
                                    eventType="validation"
                                    buttonLabel="Maak nieuwe levering"
                                    hideDescription
                                    isActive
                                />
                            </div>
                        )}
                </AccordionContent>
            </AccordionItem>

            {isOfficial && (
                <>
                    {/* {validationPackage?.Report_Status === 'valid' && (
                        !data?.Is_Valid &&
                        <Notification
                            variant="warning"
                            title="De levering kan niet worden gemaakt omdat nog niet alle verplichte velden van de versie zijn ingevuld."
                            className="my-6"
                        />
                    )} */}

                    <AccordionItem value="item-2" className="mt-6">
                        <AccordionTrigger>
                            <Text size="m" bold color="text-pzh-blue-500">
                                Publicatie
                            </Text>
                        </AccordionTrigger>
                        <AccordionContent>
                            {validationPackage?.Report_Status === 'valid' && (
                                <Notification
                                    title="Let op! Een versie kan niet worden bewerkt of verwijderd nadat je op ‘Maak levering’ hebt geklikt."
                                    className="w-full"
                                />
                            )}

                            <PackageStep
                                version={version}
                                type="create"
                                eventType="publication"
                                isActive={
                                    validationPackage?.Report_Status === 'valid'
                                    //&& data?.Is_Valid
                                }
                                isSucceeded={!!publicationPackage}
                                isFirst
                            />
                            <PackageStep
                                version={version}
                                type="download"
                                eventType="publication"
                                isActive={!!publicationPackage}
                                isLast={!isOfficial}
                                isSucceeded={
                                    !!publicationPackage?.Zip
                                        .Latest_Download_Date
                                }
                            />
                            <PackageStep
                                version={version}
                                type="upload"
                                eventType="publication"
                                isActive={
                                    !!publicationPackage?.Zip
                                        .Latest_Download_Date
                                }
                                isSucceeded={
                                    publicationPackage?.Report_Status ===
                                    'valid'
                                }
                                isLast
                            />
                        </AccordionContent>
                    </AccordionItem>
                </>
            )}

            {isOfficial &&
                publicationPackage?.Report_Status === 'valid' &&
                !!!announcement && (
                    <div className="my-6 flex w-full justify-between gap-4">
                        <Notification
                            variant="positive"
                            title={`Publicatie gelukt. Wordt bekend gemaakt op ${announcementDate}, treedt in werking op ${effectiveDate}.`}
                            className="w-full"
                        />
                        {(procedureType as ProcedureType) === 'draft' &&
                            !!publicationPackage && (
                                <Button
                                    variant="cta"
                                    onPress={() =>
                                        createAnnouncement({
                                            actPackageUuid:
                                                publicationPackage.UUID,
                                        })
                                    }
                                    className="whitespace-nowrap">
                                    Maak kennisgeving
                                </Button>
                            )}
                    </div>
                )}

            {isOfficial && publicationPackage?.Report_Status === 'failed' && (
                <div className="my-6 flex w-full justify-between gap-4">
                    <Notification
                        variant="negative"
                        title="Publicatie niet gelukt. Bewerk de versie en probeer het opnieuw."
                        className="w-full"
                    />
                    <PackageStepActions
                        version={version}
                        type="create"
                        eventType="publication"
                        buttonLabel="Maak nieuwe levering"
                        hideDescription
                        isActive
                    />
                </div>
            )}

            {!!announcement && (procedureType as ProcedureType) === 'draft' && (
                <div className="mt-8">
                    <PublicationAnnouncement
                        handleUpdateAction={() => {
                            setActiveModal('publicationPackages', {
                                ...modalState,
                                announcementUuid: announcement.UUID,
                            })
                            handleUpdateAction()
                        }}
                        {...announcement}
                    />
                </div>
            )}
        </Accordion>
    )
}

export default PublicationPackages
