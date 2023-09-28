import { Heading, Text } from '@pzh-ui/components'

import { StepProps } from './types'

export const StepTwo = ({ createdUser }: StepProps) => {
    const mailTo = {
        subject: 'Nieuw wachtwoord',
        body: `Je wachtwoord voor https://omgevingsbeleid.zuid-holland.nl is aangepast, je nieuwe wachtwoord is:\n${createdUser?.Password}`,
    }

    return (
        <>
            <Heading level="2" className="mb-2">
                Wachtwoord voor nieuwe gebruiker
            </Heading>
            <Text className="mb-4">
                Gegenereerd wachtwoord: <strong>{createdUser?.Password}</strong>
            </Text>
            <Text>
                Verstuur het wachtwoord naar de gebruiker:
                <br />
                <a
                    href={`mailto:${createdUser?.Email}?subject=${mailTo.subject}&body=${mailTo.body}`}
                    className="text-pzh-green underline hover:text-pzh-green-dark">
                    E-mail naar {createdUser?.Email}
                </a>
            </Text>
        </>
    )
}
