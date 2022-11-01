import { ReactNode } from 'react'

import useAuth from '@/hooks/useAuth'

import Footer from '../components/Footer'
import Navigation from '../components/Navigation'

interface BaseLayoutProps {
    hideFooter?: boolean
    children?: ReactNode
}

export function BaseLayout({ hideFooter, children }: BaseLayoutProps) {
    const { user } = useAuth()

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation loggedIn={!!user} />

            <main>{children}</main>

            {!hideFooter && <Footer />}
        </div>
    )
}
