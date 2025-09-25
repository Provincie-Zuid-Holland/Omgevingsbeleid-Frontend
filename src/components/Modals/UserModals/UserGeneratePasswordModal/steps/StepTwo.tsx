import { Heading, Text } from '@pzh-ui/components'

import { StepProps } from './types'

export const StepTwo = ({ newPassword, user }: StepProps) => {
    const mailTo = {
        subject: 'Nieuw wachtwoord',
        body: `Je wachtwoord voor https://omgevingsbeleid.zuid-holland.nl is aangepast, je nieuwe wachtwoord is:%0D%0A${newPassword}`,
    }

    return (
        <>
            <Heading level="2" size="xl">
                Wachtwoord opgeslagen
            </Heading>
            <Text>
                Gegenereerd wachtwoord: <strong>{newPassword}</strong>
            </Text>
            <Text>
                Verstuur het nieuwe wachtwoord naar de gebruiker:
                <br />
                <a
                    href={`mailto:${user?.Email}?subject=${mailTo.subject}&body=${mailTo.body}`}
                    className="text-pzh-green-500 hover:text-pzh-green-900 underline">
                    E-mail naar {user?.Email}
                </a>
            </Text>
        </>
    )
}
