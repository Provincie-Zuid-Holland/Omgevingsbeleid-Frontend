import {
    DocumentType,
    ProcedureType,
    PublicationEnvironment,
    PublicationVersion,
} from '@/api/fetchers.schemas'

export const config = {
    documentType: {
        omgevingsvisie: {
            label: 'Visie',
        },
        programma: {
            label: 'Programma',
        },
    },
    packageType: {
        validation: {
            label: 'Validatie',
        },
        publication: {
            label: 'Publicatie',
        },
    },
    publicationType: {
        act: {
            label: 'Regeling',
        },
        announcement: {
            label: 'Kennisgeving',
        },
    },
    procedureType: {
        draft: {
            label: 'Ontwerp',
        },
        final: {
            label: 'Definitief',
        },
    },
}

export const buildVersionTitle = (
    version?: PublicationVersion,
    environment?: PublicationEnvironment
) => {
    const procedureLabel =
        version?.publication &&
        config.procedureType[
            version.publication.procedure_type as ProcedureType
        ]?.label

    const documentLabel =
        version?.publication &&
        config.documentType[version.publication.document_type as DocumentType]
            ?.label

    const title =
        procedureLabel && documentLabel
            ? `${procedureLabel} - ${documentLabel}${
                  environment?.title ? ` (${environment.title})` : ''
              }`
            : null

    return title
}
