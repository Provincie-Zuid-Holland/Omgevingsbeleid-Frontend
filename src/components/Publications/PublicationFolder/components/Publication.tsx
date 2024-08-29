import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Badge,
    Button,
    Heading,
    Text,
} from '@pzh-ui/components'
import { AngleRight, ArrowDownToSquare, PenToSquare } from '@pzh-ui/icons'

import { usePublicationsPublicationUuidVersionsGet } from '@/api/fetchers'
import {
    PublicationEnvironment,
    Publication as PublicationType,
} from '@/api/fetchers.schemas'

import Version from './Version'
import VersionAdd from './VersionAdd'

interface PublicationProps extends PublicationType {
    environment?: PublicationEnvironment
}

const Publication = ({ UUID, Title, environment }: PublicationProps) => {
    const { data: versions } = usePublicationsPublicationUuidVersionsGet(
        UUID || '',
        {
            limit: 100,
        }
    )

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
                        <Badge text="Actief" upperCase={false} />
                    </div>
                </div>
                <div className="flex w-2/12 items-center pl-6 pr-2 text-left">
                    <div>
                        <Text
                            size="s"
                            color="text-pzh-blue-500"
                            className="font-normal">
                            Afgerond op
                        </Text>
                        <Text size="s" bold color="text-pzh-blue-500">
                            TO-DO: Datum toevoegen
                        </Text>
                    </div>
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
                    />
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
                {versions?.results.map(version => (
                    <Version key={version.UUID} {...version} />
                ))}
                <VersionAdd />
            </AccordionContent>
        </AccordionItem>
    )
}

export default Publication
