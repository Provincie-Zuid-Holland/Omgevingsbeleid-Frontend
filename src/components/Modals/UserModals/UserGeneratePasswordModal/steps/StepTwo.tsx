import { Heading, Text } from '@pzh-ui/components'

import { StepProps } from './types'

export const StepTwo = ({ newPassword, user }: StepProps) => {
    const mailTo = {
        subject: 'Nieuw wachtwoord',
        body: `Je wachtwoord voor https://omgevingsbeleid.zuid-holland.nl is aangepast, je nieuwe wachtwoord is:\n${newPassword}`,
    }

    return (
        <>
            <Heading level="2" className="mb-2">
                Wachtwoord opgeslagen
            </Heading>
            <Text className="mb-4">
                Gegenereerd wachtwoord: <strong>{newPassword}</strong>
            </Text>
            <Text>
                Verstuur het nieuwe wachtwoord naar de gebruiker:
                <br />
                <a
                    href={`mailto:${user?.Email}?subject=${mailTo.subject}&body=${mailTo.body}`}
                    className="text-pzh-green underline hover:text-pzh-green-dark">
                    E-mail naar {user?.Email}
                </a>
            </Text>
        </>
    )
}
