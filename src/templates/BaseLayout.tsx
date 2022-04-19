import { ReactNode } from 'react'

import Footer from '../components/Footer'
import Navigation from '../components/Navigation'

interface BaseLayoutProps {
    loggedIn: boolean
    hideFooter?: boolean
    children?: ReactNode
}

export function BaseLayout({
    loggedIn,
    hideFooter,
    children,
}: BaseLayoutProps) {
    return (
        <>
            <Navigation loggedIn={loggedIn} />

            <main>{children}</main>

            {!hideFooter && <Footer />}
        </>
    )
}
