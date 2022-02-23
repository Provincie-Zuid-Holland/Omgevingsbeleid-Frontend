import { ReactNode } from 'react'

import Footer from '../Footer'
import Navigation from '../Navigation'

interface BaseLayoutProps {
    loggedIn: boolean
    children?: ReactNode
}

export function BaseLayout({ loggedIn, children }: BaseLayoutProps) {
    return (
        <>
            <Navigation loggedIn={loggedIn} />

            <main>{children}</main>

            <Footer />
        </>
    )
}
