import { ReactNode } from 'react'

import Footer from '../components/Footer'
import Navigation from '../components/Navigation'

interface BaseLayoutProps {
    hideFooter?: boolean
    children?: ReactNode
}

export function BaseLayout({ hideFooter, children }: BaseLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main>{children}</main>

            {!hideFooter && <Footer />}
        </div>
    )
}
