import { ReactNode, useEffect, useRef } from 'react'

import { useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Navigation from '../components/Navigation'

interface BaseLayoutProps {
    hideFooter?: boolean
    children?: ReactNode
}

export function BaseLayout({ hideFooter, children }: BaseLayoutProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const { pathname } = useLocation()

    useEffect(() => {
        ref.current?.focus()
    }, [pathname])

    return (
        <>
            <span ref={ref} tabIndex={-1} />
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
