import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Formik } from 'formik'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'

import allDimensies from '@/constants/dimensies'
import policyObjects from '@/constants/policyObjects'
import AuthProvider from '@/context/AuthContext'

import MutatePolicy from './MutatePolicy'

const queryClient = new QueryClient()

const urls = {
    Ambitie: '/ambities/edit/1',
    Belang: '/belangen/edit/1',
    Beleidskeuze: '/beleidskeuzes/edit/1',
    Beleidsregel: '/beleidsregels/edit/1',
    Beleidsprestatie: '/beleidsprestaties/edit/1',
    Beleidsmodule: '/beleidsmodule/edit/1',
    Beleidsdoel: '/beleidsdoelen/edit/1',
    Maatregel: '/maatregelen/edit/1',
    Thema: '/themas/edit/1',
} as const

describe('MutatePolicyPage', () => {
    const defaultProps = {
        dimensieConstants: allDimensies.BELEIDSKEUZES,
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

            const titleInput = screen.getByLabelText('Titel')
            fireEvent.change(titleInput, { target: { value: 'test title' } })
            expect(titleInput).toHaveValue('test title')
        })
    })
})
