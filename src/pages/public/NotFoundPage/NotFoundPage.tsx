import { Heading, Text } from '@pzh-ui/components'
import { Helmet } from 'react-helmet-async'

import Breadcrumbs from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'

const NotFoundPage = () => {
    const breadcrumbPaths = [
        { name: 'Omgevingsbeleid', to: '/' },
        { name: 'Pagina niet gevonden' },
    ]

    return (
        <>
            <Helmet title="Pagina niet gevonden" />
            <Container className="pb-16 pt-4">
                <div className="col-span-6 mb-8">
                    <Breadcrumbs items={breadcrumbPaths} />
                </div>

                <div className="col-span-6 xl:col-span-4 xl:col-start-2">
                    <Heading level="1" size="xxl">
                        Pagina is niet gevonden
                    </Heading>
                    <Text className="mt-4">
                        Helaas, de pagina die je zoekt is niet gevonden. Het kan
                        zijn dat de pagina is verwijderd, of dat de naam is
                        gewijzigd.
                    </Text>

                    <Text className="my-4">Je kunt het volgende proberen:</Text>

                    <div className="prose prose-neutral mb-4 max-w-full leading-6 text-pzh-blue-900 marker:text-pzh-blue-900 prose-li:my-0 md:mb-8">
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
