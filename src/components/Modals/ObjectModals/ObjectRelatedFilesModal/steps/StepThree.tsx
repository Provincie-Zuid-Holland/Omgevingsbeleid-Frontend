import { FormikCheckbox, Heading, Text } from '@pzh-ui/components'

import { StepProps } from './types'

export const StepThree = ({ selectedFile }: StepProps) => (
    <>
        <Heading level="2" size="xl" className="mb-2">
            Gerelateerd bestand ontkoppelen
        </Heading>

        <Text className="mb-4">
            Weet je zeker dat je het bestand{' '}
            <Text as="span" bold>
                {selectedFile?.Title}
            </Text>{' '}
            van dit doel wilt ontkoppelen en verwijderen? Je zal het bestand
            opnieuw moeten uploaden om het opnieuw te koppelen.
        </Text>

        <FormikCheckbox name="consent">
            Ik weet zeker dat ik dit bestand wil ontkoppelen en verwijderen
        </FormikCheckbox>
    </>
)
