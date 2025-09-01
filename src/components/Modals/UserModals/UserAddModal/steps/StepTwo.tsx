import { Heading, Text } from '@pzh-ui/components'

import { StepProps } from './types'

export const StepTwo = ({ createdUser }: StepProps) => {
    const mailTo = {
        subject: 'Nieuw wachtwoord',
        body: `Je wachtwoord voor https://omgevingsbeleid.zuid-holland.nl is aangepast, je nieuwe wachtwoord is:%0D%0A${createdUser?.Password}`,
    }

    return (
        <>
            <Heading level="2" size="xl">
                Wachtwoord voor nieuwe gebruiker
            </Heading>
            <Text>
                Gegenereerd wachtwoord: <strong>{createdUser?.Password}</strong>
            </Text>
            <Text>
                Verstuur het wachtwoord naar de gebruiker:
                <br />
                <a
                    href={`mailto:${createdUser?.Email}?subject=${mailTo.subject}&body=${mailTo.body}`}
                    className="text-pzh-green-500 hover:text-pzh-green-900 underline">
                    E-mail naar {createdUser?.Email}
                </a>
            </Text>
        </>
    )
}
