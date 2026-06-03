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
        version?.Publication &&
        config.procedureType[
            version.Publication.Procedure_Type as ProcedureType
        ]?.label

    const documentLabel =
        version?.Publication &&
        config.documentType[version.Publication.Document_Type as DocumentType]
            ?.label

    const title =
        procedureLabel && documentLabel
            ? `${procedureLabel} - ${documentLabel}${
                  environment?.Title ? ` (${environment.Title})` : ''
              }`
            : null

    return title
}
