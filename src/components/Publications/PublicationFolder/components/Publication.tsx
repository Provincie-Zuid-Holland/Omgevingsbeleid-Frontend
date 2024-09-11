import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Badge,
    BadgeProps,
    Button,
    formatDate,
    Heading,
    Text,
} from '@pzh-ui/components'
import { AngleRight, ArrowDownToSquare, PenToSquare } from '@pzh-ui/icons'
import { useMemo } from 'react'

import { usePublicationsPublicationUuidVersionsGet } from '@/api/fetchers'
import {
    PublicationEnvironment,
    Publication as PublicationType,
} from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import useModalStore from '@/store/modalStore'

import Version from './Version'
import VersionAdd from './VersionAdd'

interface PublicationProps extends PublicationType {
    environment?: PublicationEnvironment
}

const Publication = ({
    UUID,
    Title,
    Is_Locked,
    environment,
    ...rest
}: PublicationProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data: versions, isFetching } =
        usePublicationsPublicationUuidVersionsGet(UUID || '', {
            limit: 100,
        })

    const finishedDate = useMemo(
        () =>
            !!versions?.results?.[0]?.Act_Packages.length &&
            !environment?.Can_Publicate &&
            formatDate(
                new Date(String(versions.results[0].Modified_Date)),
                'd MMMM yyyy'
            ),
        [versions, environment?.Can_Publicate]
    )

    const status = useMemo((): BadgeProps | undefined => {
        if (finishedDate) {
            return {
                text: 'Afgerond',
                variant: 'green',
                solid: true,
            }
        }

        return {
            text: 'Actief',
            variant: 'green',
        }
    }, [finishedDate])

    return (
        <AccordionItem value={UUID} className="last:border-b-0">
            <AccordionTrigger
                hideIcon
                className="flex h-16 border-pzh-gray-200 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]_[data-icon=angle]]:rotate-90">
                <div className="flex h-[inherit] w-5/12 items-center border-r border-pzh-gray-200 pl-10 pr-6">
                    <div className="flex h-[inherit] w-full items-center justify-between border-l border-pzh-gray-200 pl-8">
                        <div className="flex items-center gap-4">
                            <AngleRight
                                size={20}
                                className="transition-transform duration-200"
                                data-icon="angle"
                            />
                            <ArrowDownToSquare
                                size={20}
                                className="text-pzh-blue-100"
                            />
                            <Heading
                                level="3"
                                size="s"
                                className="-mb-1 first-letter:capitalize">
                                {environment?.Title} publicatie
                            </Heading>
                        </div>
                        {isFetching ? (
                            <LoaderCard height="24" className="w-20" mb="0" />
                        ) : (
                            !!status && <Badge upperCase={false} {...status} />
                        )}
                    </div>
                </div>
                <div className="flex w-2/12 items-center pl-6 pr-2 text-left">
                    {finishedDate && (
                        <div>
                            <Text
                                size="s"
                                color="text-pzh-blue-500"
                                className="font-normal">
                                Afgerond op
                            </Text>
                            <Text size="s" bold color="text-pzh-blue-500">
                                {finishedDate}
                            </Text>
                        </div>
                    )}
                </div>
                <div className="flex w-3/12 items-center px-2 text-left">
                    <div>
                        <Text
                            size="s"
                            color="text-pzh-blue-500"
                            className="font-normal">
                            Interne titel
                        </Text>
                        <Text size="s" bold color="text-pzh-blue-500">
                            {Title}
                        </Text>
                    </div>
                </div>
                <div className="flex w-2/12 items-center justify-end gap-2 px-2">
                    <Button
                        size="small"
                        variant="secondary"
                        icon={PenToSquare}
                        iconSize={16}
                        aria-label="Wijzig publicatie"
                        isDisabled={Is_Locked}
                        onPress={() =>
                            setActiveModal('publicationEdit', {
                                publication: {
                                    UUID,
                                    Title,
                                    Is_Locked,
                                    ...rest,
                                },
                            })
                        }
                    />
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
                {versions?.results.map(version => (
                    <Version
                        key={version.UUID}
                        environment={environment}
                        publication={{ UUID, Title, Is_Locked, ...rest }}
                        {...version}
                    />
                ))}
                <VersionAdd publicationUUID={UUID} />
            </AccordionContent>
        </AccordionItem>
    )
}

export default Publication
