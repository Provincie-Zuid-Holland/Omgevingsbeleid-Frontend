import { string, object, array, mixed, lazy } from 'yup'

import { BeleidskeuzesWriteStatus } from '@/api/fetchers.schemas'
import {
    PolicyTitlesPlural,
    PolicyTitlesSingular,
} from '@/constants/policyObjects'

const possibleStatusses = Object.values(BeleidskeuzesWriteStatus)

/**
 * Contains the yup validation schema for shared properties
 */
export const schemaDefaults = {
    requiredString: (msg: string) => string().required(msg),
    optionalString: string().optional().nullable(),
    // listReference can be of type read or write
    listReference: lazy(value =>
        value?.UUID !== undefined
            ? array()
                  .of(
                      object({
                          Koppeling_Omschrijving: string(),
                          UUID: string(),
                      })
                  )
                  .nullable()
            : array()
                  .of(
                      object({
                          Koppeling_Omschrijving: string(),
                          Object: object(),
                      })
                  )
                  .nullable()
    ),
    Titel: string()
        .required('Vul een titel in')
        .min(4, 'Vul een titel in van minimaal 4 karakters')
        .max(100, 'Vul een titel in van maximaal 100 karakters')
        .default(undefined)
        .nullable(),
    Begin_Geldigheid: {
        required: string()
            .required('Vul een datum van inwerkingstreding in')
            .default(undefined),
        requiredBasedOnStatusses: (statusses: string[]) =>
            string()
                .test(
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
                )
                .nullable(),
        notRequired: string().default(undefined).nullable(),
    },
    Eind_Geldigheid: string()
        .nullable()
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
    Status: mixed().oneOf(possibleStatusses).required(),
}

export const generateSchemaTitles = ({
    titleSingular,
    titlePlural,
    prefixSingular,
    prefixPlural,
}: {
    titleSingular: PolicyTitlesSingular
    titlePlural: PolicyTitlesPlural
    prefixSingular: string
    prefixPlural: string
}) => {
    const capitalizeFirstLetter = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1)

    return {
        singular: titleSingular,
        singularCapitalized: capitalizeFirstLetter(
            titleSingular
        ) as Capitalize<PolicyTitlesSingular>,
        plural: titlePlural,
        pluralCapitalized: capitalizeFirstLetter(
            titlePlural
        ) as Capitalize<PolicyTitlesPlural>,
        prefixSingular: prefixSingular,
        prefixSingularCapitalized: capitalizeFirstLetter(prefixSingular),
        prefixPlural: prefixPlural,
        prefixPluralCapitalized: capitalizeFirstLetter(prefixPlural),
    }
}
