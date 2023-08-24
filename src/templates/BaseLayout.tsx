import { ReactNode } from 'react'

import Footer from '../components/Footer'
import Navigation from '../components/Navigation'

interface BaseLayoutProps {
    hideFooter?: boolean
    children?: ReactNode
}

export function BaseLayout({ hideFooter, children }: BaseLayoutProps) {
    return (
        <>
            <a
                href="#content"
                className="sr-only focus:not-sr-only focus:ring-1 focus:ring-inset">
                Ga direct naar de inhoud
            </a>

            <Navigation />

            <main id="content">{children}</main>

            {!hideFooter && <Footer />}
        </>
    )
}
