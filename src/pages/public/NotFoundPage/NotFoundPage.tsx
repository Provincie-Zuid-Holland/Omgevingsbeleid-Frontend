import { Breadcrumbs, Heading, Text } from '@pzh-ui/components'
import { Helmet } from 'react-helmet'

import { Container } from '@/components/Container'

const NotFoundPage = () => {
    const pathName = location.pathname || ''

    const breadcrumbPaths = [
        { name: 'Omgevingsbeleid', path: '/' },
        { name: 'Pagina niet gevonden', path: pathName },
    ]

    return (
        <>
            <Helmet title="Pagina niet gevonden" />
            <Container className="pb-16 pt-4">
                <div className="col-span-6 mb-8">
                    <Breadcrumbs items={breadcrumbPaths} />
                </div>

                <div className="col-span-6 xl:col-span-4 xl:col-start-2">
                    <Heading level="1">Pagina is niet gevonden</Heading>
                    <Text className="mt-4">
                        Helaas, de pagina die je zoekt is niet gevonden. Het kan
                        zijn dat de pagina is verwijderd, of dat de naam is
                        gewijzigd.
                    </Text>

                    <Text className="my-4">Je kunt het volgende proberen:</Text>

                    <div className="prose prose-neutral prose-li:my-0 mb-4 md:mb-8 max-w-full text-pzh-blue-dark marker:text-pzh-blue-dark leading-6">
                        <ul>
                            <li>
                                Controleer het internetadres in de adresbalk.
                            </li>
                            <li>
                                Gebruik de 'vorige' knop van je browser om terug
                                te gaan naar de vorige pagina en probeer een
                                andere link.
                            </li>
                            <li>
                                Klik op het Logo om terug te keren naar de
                                homepage.
                            </li>
                        </ul>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default NotFoundPage
