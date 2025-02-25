import { Hyperlink, Notification } from '@pzh-ui/components'

import { Container } from '@/components/Container'

const TempAlert = () => {
    const expirationDate = new Date('03-24-2025').setHours(0, 0, 0, 0)
    const today = new Date().setHours(0, 0, 0, 0)

    if (today > expirationDate) return null

    return (
        <Container>
            <div className="col-span-6">
                <Notification title="Internetconsultatie" className="w-full">
                    <>
                        De internetconsultatie voor Herziening 2025 loopt van 6
                        maart 2025 t/m 24 maart 2025,{' '}
                        <Hyperlink asChild>
                            <a
                                href="https://www.zuid-holland.nl/onderwerpen/omgevingsbeleid/lopende-herzieningen-omgevingsbeleid/"
                                rel="noopener noreferrer"
                                target="_blank">
                                klik hier voor meer informatie!
                            </a>
                        </Hyperlink>
                    </>
                </Notification>
            </div>
        </Container>
    )
}

export default TempAlert
