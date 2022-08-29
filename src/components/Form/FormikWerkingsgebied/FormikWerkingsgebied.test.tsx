import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import { QueryClient, QueryClientProvider } from 'react-query'

import FormikWerkingsgebied from './FormikWerkingsgebied'

const queryClient = new QueryClient()

describe('FormikWerkingsgebied', () => {
    const defaultProps = {
        disabled: false,
        titleSingular: 'Beleidskeuze',
        label: 'Selecteer werkingsgebied',
        description:
            'Selecteer het werkingsgebied wat bij deze beleidskeuze van toepassing is. Heeft jouw beleidskeuze nog geen geschikt werkingsgebied, of moet het huidige gebied aangepast worden? Neem dan contact op via omgevingsbeleid@pzh.nl.',
        dataObjectProperty: 'Werkingsgebieden',
    } as const

    const setup = () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Formik
                    initialValues={{}}
                    onSubmit={() => console.log('woehoe')}>
                    <>
                        <FormikWerkingsgebied {...defaultProps} />)
                    </>
                </Formik>
            </QueryClientProvider>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Selecteer werkingsgebied')
        expect(element).toBeTruthy()
    })
})
