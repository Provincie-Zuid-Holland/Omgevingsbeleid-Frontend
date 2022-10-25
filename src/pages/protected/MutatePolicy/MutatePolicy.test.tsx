import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Formik } from 'formik'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

import allDimensies from '@/constants/dimensies'
import policyObjects from '@/constants/policyObjects'
import AuthProvider from '@/context/AuthContext'

import MutatePolicy from './MutatePolicy'

const queryClient = new QueryClient()

const urls = {
    Ambitie: '/muteer/ambities/1/bewerk',
    Belang: '/muteer/belangen/1/bewerk',
    Beleidskeuze: '/muteer/beleidskeuzes/1/bewerk',
    Beleidsregel: '/muteer/beleidsregels/1/bewerk',
    Beleidsprestatie: '/muteer/beleidsprestaties/1/bewerk',
    Beleidsmodule: '/muteer/beleidsmodule/1/bewerk',
    Beleidsdoel: '/muteer/beleidsdoelen/1/bewerk',
    Maatregel: '/muteer/maatregelen/1/bewerk',
    Thema: '/muteer/themas/1/bewerk',
} as const

describe('MutatePolicyPage', () => {
    const defaultProps = {
        policyConstants: policyObjects.BELEIDSKEUZES,
    }

    const setup = (url: string) => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[url]}>
                    <AuthProvider>
                        <Formik
                            initialValues={{}}
                            onSubmit={() => console.log('✅')}>
                            <MutatePolicy {...defaultProps} />
                        </Formik>
                    </AuthProvider>
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    ;(Object.keys(urls) as Array<keyof typeof urls>).forEach(key => {
        it(`Mutate page renders and user can change the title for ${key}`, () => {
            setup(urls[key])

            const element = screen.getByText('Algemene informatie')
            expect(element).toBeTruthy()

            const titleInput = screen.getByLabelText(/Titel/)
            fireEvent.change(titleInput, { target: { value: 'test title' } })
            expect(titleInput).toHaveValue('test title')
        })
    })
})
