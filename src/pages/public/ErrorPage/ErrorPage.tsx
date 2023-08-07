import { FallbackProps } from 'react-error-boundary'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

const ErrorPage = ({ resetErrorBoundary }: FallbackProps) => (
    <>
        <Helmet title="ErrorPage">
            <meta
                property="og:title"
                content="Error pagina - Omgevingsbeleid Provincie Zuid-Holland"
            />
            <meta
                property="og:description"
                content="Error pagina waarop staat beschreven dat er iets technisch fout is gegaan en dat deze melding geregistreerd wordt."
            />
        </Helmet>
        <div className="h-full w-full py-10" data-testid="errorboundary">
            <div className="mx-auto max-w-4xl px-5 sm:px-24 lg:px-8">
                <h1 className="mt-8 text-2xl font-bold text-pzh-blue md:text-4xl">
                    Er is iets fout gegaan
                </h1>
                <div className="mt-4 text-pzh-blue-dark md:mt-5">
                    Helaas is er technisch iets fout gegaan. Deze melding is
                    geregistreerd en we gaan er voor zorgen dat dit in de
                    toekomst niet meer kan gebeuren.
                </div>
                <Link to="/" onClick={resetErrorBoundary}>
                    <div className="mt-10 h-12 w-56 rounded bg-pzh-blue py-3 text-center font-bold text-white hover:bg-pzh-green">
                        Terug naar de startpagina
                    </div>
                </Link>
            </div>
        </div>
    </>
)

export default ErrorPage
