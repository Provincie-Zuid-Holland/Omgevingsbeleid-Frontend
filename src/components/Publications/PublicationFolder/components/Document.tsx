import { useMemo } from 'react'

import { Badge, Button, Heading } from '@pzh-ui/components'
import { Gear } from '@pzh-ui/icons'

import { Link, useParams } from 'react-router-dom'

import { usePublicationVersionsGetListVersions } from '@/api/fetchers'
import {
    DocumentType,
    ProcedureType,
    Publication,
    PublicationEnvironment,
} from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import useModule from '@/hooks/useModule'
import useModalStore from '@/store/modalStore'

const config = {
    omgevingsvisie: {
        label: 'Visie',
    },
    programma: {
        label: 'Programma',
    },
}

interface DocumentProps {
    environment: PublicationEnvironment
    documentType: DocumentType
    procedureType: ProcedureType
    publication?: Publication
    canCreate?: boolean
}

const Document = ({
    environment,
    documentType,
    procedureType,
    publication,
    canCreate,
}: DocumentProps) => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const { isClosed } = useModule()

    const { data: version, isFetching } = usePublicationVersionsGetListVersions(
        publication?.UUID || '',
        {
            limit: 100,
        },
        {
            query: {
                enabled: !!publication?.UUID,
                select: data => data.results[0],
            },
        }
    )

    const status = useMemo(
        () =>
            version?.Status === 'completed'
                ? { text: 'Afgerond', solid: true }
                : { text: 'Actief', solid: false },
        [version?.Status]
    )

    return (
        <div className="flex h-16 items-center justify-between border-b border-pzh-gray-200 px-6 last:border-b-0">
            <Heading level="4" size="m" className="capitalize">
                {config[documentType].label}
            </Heading>

            {isFetching ? (
                <LoaderCard height="24" className="w-44" mb="0" />
            ) : !!publication && !!version ? (
                <div className="flex items-center gap-3">
                    <Badge upperCase={false} variant="green" {...status} />
                    <Button size="small" variant="cta" asChild>
                        <Link
                            to={`/muteer/modules/${moduleId}/besluiten/${version.UUID}/leveringen`}>
                            Leveringen
                        </Link>
                    </Button>
                    <Button
                        size="small"
                        variant="secondary"
                        icon={Gear}
                        iconSize={16}
                        aria-label="Instrument bewerken"
                        isDisabled={isClosed || version.Is_Locked}
                        onPress={() =>
                            setActiveModal('publicationEdit', { publication })
                        }
                    />
                </div>
            ) : (
                <Button
                    size="small"
                    variant="primary"
                    isDisabled={
                        isClosed || (procedureType === 'final' && !canCreate)
                    }
                    onPress={() =>
                        setActiveModal('publicationAdd', {
                            documentType,
                            procedureType,
                            environmentUUID: environment.UUID,
                        })
                    }>
                    Maak aan
                </Button>
            )}
        </div>
    )
}

export default Document
