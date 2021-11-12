import React from "react"
import { Helmet } from "react-helmet"
import { withRouter, useHistory } from "react-router-dom"

const Foutpagina = () => {
    const history = useHistory()
    return (
        <React.Fragment>
            <Helmet>
                <title>
                    Foutpagina - Omgevingsbeleid Provincie Zuid-Holland
                </title>
                <meta
                    property="og:title"
                    content="Foutpagina - Omgevingsbeleid Provincie Zuid-Holland"
                />
                <meta
                    property="og:description"
                    content="Foutpagina waarop staat beschreven dat er iets technisch fout is gegaan en dat deze melding geregistreerd wordt."
                />
            </Helmet>
            <div className="container items-center justify-between mx-auto">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="mt-8 text-4xl font-bold text-pzh-blue">
                        Er is iets fout gegaan
                    </h1>
                    <div className="mt-4 text-pzh-blue-dark">
                        Helaas is er technisch iets fout gegaan. Deze melding is
                        geregistreerd en we gaan er voor zorgen dat dit in de
                        toekomst niet meer kan gebeuren.
                    </div>
                    <button
                        className="w-56 h-12 px-5 py-2 mt-10 font-bold text-center text-white rounded bg-pzh-blue hover:bg-pzh-green"
                        onClick={() => history.push("/")}
                    >
                        Terug naar de startpagina
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default withRouter(Foutpagina)
