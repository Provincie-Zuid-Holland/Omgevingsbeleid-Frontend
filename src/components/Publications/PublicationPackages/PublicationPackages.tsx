import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Heading,
} from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import clsx from 'clsx'

import {
    PublicationAnnouncementShort,
    PublicationEnvironment,
    PublicationPackage,
    PublicationShort,
    PublicationVersion,
} from '@/api/fetchers.schemas'

import { PublicationType } from '../types'
import AnnouncementData from './components/AnnouncementData'
import { ActPackages, AnnouncementPackages } from './components/Packages'

const config = {
    act: {
        label: 'Regeling',
        component: ActPackages,
    },
    announcement: {
        label: 'Kennisgeving',
        component: AnnouncementPackages,
    },
}

interface PublicationPackagesProps {
    environment?: PublicationEnvironment
    version: PublicationVersion
    publication?: PublicationShort
    publicationType: PublicationType
    validPublicationPackage?: PublicationPackage
    announcement?: PublicationAnnouncementShort
    isLocked?: boolean
    isDisabled?: boolean
}

const PublicationPackages = ({
    environment,
    publicationType,
    version,
    announcement,
    isDisabled,
    ...rest
}: PublicationPackagesProps) => {
    const Packages = config[publicationType].component

    return (
        <AccordionItem
            value={publicationType}
            disabled={isDisabled}
            className={clsx('group rounded-lg border border-pzh-gray-200', {
                'bg-pzh-gray-100': version.Is_Locked,
            })}>
            <AccordionTrigger
                hideIcon
                className="flex h-16 items-center justify-between rounded-t-lg bg-pzh-gray-100 px-6 group-only:hover:cursor-default group-only:hover:no-underline [&[data-disabled]>*]:text-pzh-gray-300 hover:[&[data-disabled]]:no-underline [&[data-state=closed]]:rounded-b-lg [&[data-state=open]>svg]:rotate-90">
                <Heading level="3" size="m" className="capitalize">
                    {config[publicationType].label}
                </Heading>
                <AngleRight
                    size={20}
                    className="transition-transform duration-200 group-only:hidden"
                />
            </AccordionTrigger>
            <AccordionContent className="pb-0">
                {publicationType === 'announcement' && !!announcement && (
                    <AnnouncementData {...announcement} {...rest} />
                )}
                {environment?.Can_Validate && (
                    <Packages
                        version={version}
                        publicationType={publicationType}
                        packageType="validation"
                        customLabel={
                            !environment.Can_Publicate
                                ? 'Publicatie'
                                : undefined
                        }
                        canPublicate={environment.Can_Publicate}
                        {...rest}
                    />
<<<<<<< HEAD
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
=======
>>>>>>> dev
                )}
                {environment?.Can_Publicate && (
                    <Packages
                        version={version}
                        publicationType={publicationType}
                        packageType="publication"
                        canPublicate={environment.Can_Publicate}
                        {...rest}
                    />
                )}
            </AccordionContent>
        </AccordionItem>
    )
}

export default PublicationPackages
