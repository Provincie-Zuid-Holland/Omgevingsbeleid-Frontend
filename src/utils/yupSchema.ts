import { string, object, array, mixed } from 'yup'

import { BeleidskeuzesWriteStatus } from '@/api/fetchers.schemas'

const possibleStatusses = Object.values(BeleidskeuzesWriteStatus)

// TODO: Add required for fields based on status

/**
 * Contains the yup validation schema for shared properties
 */
export const schemaDefaults = {
    optionalString: string().optional(),
    listReference: array().of(
        object({
            Koppeling_Omschrijving: string().required(),
            UUID: string().required(),
        })
    ),
    Titel: string()
        .required('Vul een titel in')
        .min(4, 'Vul een titel in van minimaal 4 karakters')
        .max(100, 'Vul een titel in van maximaal 100 karakters')
        .default(undefined),
    Begin_Geldigheid: {
        required: string()
            .required('Vul een datum van inwerkingstreding in')
            .default(undefined),
        requiredBasedOnStatusses: (statusses: string[]) =>
            string().test(
                'validate-based-on-status',
                'Vul een datum van inwerkingstreding in',
                function (Begin_Geldigheid) {
                    const currentStatus = this.parent.Status
                    if (
                        statusses.includes(currentStatus) &&
                        !Begin_Geldigheid
                    ) {
                        return false
                    } else if (
                        statusses.includes(currentStatus) &&
                        Begin_Geldigheid
                    ) {
                        return true
                    } else if (!statusses.includes(currentStatus)) {
                        return true
                    } else {
                        return false
                    }
                }
            ),
        notRequired: string().default(undefined),
    },
    Eind_Geldigheid: string()
        .optional()
        .test(
            'after-start-validity',
            'De uitwerkingtreding mag niet voor de inwerkingtreding zijn',
            function (value) {
                if (!value) return true
                const startValidity = new Date(this.parent.Begin_Geldigheid)
                const endValidity = new Date(value)

                return startValidity < endValidity
            }
        ),
    Status: mixed().oneOf(possibleStatusses),
}

export const generateSchemaTitles = ({
    titleSingular,
    titlePlural,
    prefixSingular,
    prefixPlural,
}: {
    titleSingular: string
    titlePlural: string
    prefixSingular: string
    prefixPlural: string
}) => {
    const capitalizeFirstLetter = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1)

    return {
        singular: titleSingular,
        singularCapitalized: capitalizeFirstLetter(titleSingular),
        plural: titlePlural,
        pluralCapitalized: capitalizeFirstLetter(titlePlural),
        prefixSingular: prefixSingular,
        prefixSingularCapitalized: capitalizeFirstLetter(prefixSingular),
        prefixPlural: prefixPlural,
        prefixPluralCapitalized: capitalizeFirstLetter(prefixPlural),
    }
}
