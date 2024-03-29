import { Button, Heading, Text } from '@pzh-ui/components'
import { Key } from '@pzh-ui/icons'

import { StepProps } from './types'

export const StepOne = ({ handleClick, handleClose, isLoading }: StepProps) => (
    <>
        <Heading level="2" className="mb-4">
            Nieuw wachtwoord
        </Heading>
        <Text className="mb-6">
            Wanneer je een nieuw wachtwoord laat genereren, is het oude
            wachtwoord niet meer te gebruiken. Het systeem maakt een nieuw
            wachtwoord aan, de functioneel beheerder dient dit wachtwoord per
            mail te delen met de gebruiker zodat deze weer opnieuw kan inloggen.
        </Text>
        <div className="flex items-center justify-between border-t border-pzh-gray-200 pt-6">
            <Button variant="link" onPress={handleClose}>
                Annuleren
            </Button>

            <div className="ml-auto">
                <Button
                    variant="cta"
                    icon={Key}
                    iconSize={20}
                    onPress={handleClick}
                    isLoading={isLoading}
                    isDisabled={isLoading}>
                    Genereer nieuw wachtwoord
                </Button>
            </div>
        </div>
    </>
)
