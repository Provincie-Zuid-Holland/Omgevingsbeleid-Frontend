import { Button, Heading, Text } from '@pzh-ui/components'
import { FallbackProps } from 'react-error-boundary'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

const ErrorPage = ({ resetErrorBoundary }: FallbackProps) => {
    const navigate = useNavigate()

    return (
        <>
            <Helmet title="Error pagina">
                <meta
                    property="og:title"
                    content="Error pagina - Omgevingsbeleid Provincie Zuid-Holland"
                />
                <meta
                    property="og:description"
                    content="Error pagina waarop staat beschreven dat er iets technisch fout is gegaan en dat deze melding geregistreerd wordt."
                />
            </Helmet>
            <div className="h-full w-full py-20" data-testid="errorboundary">
                <div className="mx-auto max-w-4xl px-5 sm:px-24 lg:px-8">
                    <Heading size="xxl">Er is iets fout gegaan</Heading>
                    <Text className="my-4 md:mt-5">
                        Helaas is er technisch iets fout gegaan. Deze melding is
                        geregistreerd en we gaan er voor zorgen dat dit in de
                        toekomst niet meer kan gebeuren.
                    </Text>
                    <Button
                        onPress={() => {
                            resetErrorBoundary()
                            navigate('/')
                        }}>
                        Terug naar de startpagina
                    </Button>
                </div>
            </div>
        </>
    )
}

export default ErrorPage
