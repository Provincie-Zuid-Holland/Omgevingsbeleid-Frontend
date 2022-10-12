import {
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { Formik } from 'formik'
import { QueryClient, QueryClientProvider } from 'react-query'

import FormikSelectUserGroup, {
    FormikSelectUserGroupProps,
} from './FormikSelectUserGroup'

describe('FormikSelectUserGroup', () => {
    const defaultProps = {}
    const queryClient = new QueryClient()
    const handleSubmit = jest.fn()

    const setup = (customProps?: FormikSelectUserGroupProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <Formik
                    initialValues={{
                        Afbeelding: null,
                    }}
                    onSubmit={handleSubmit}>
                    <FormikSelectUserGroup {...props} />
                </Formik>
            </QueryClientProvider>
        )
    }

    it('Component renders', async () => {
        setup()
        await waitForElementToBeRemoved(() => screen.getAllByRole('img'))
        expect(screen.getByText('Personen')).toBeInTheDocument()
        expect(screen.getByText('Ambtelijk opdrachtgever')).toBeInTheDocument()
        expect(screen.getByText('Eerste eigenaar')).toBeInTheDocument()
        expect(screen.getByText('Tweede eigenaar')).toBeInTheDocument()
        expect(
            screen.getByText('Eerste portefeuillehouder')
        ).toBeInTheDocument()
        expect(
            screen.getByText('Tweede portefeuillehouder')
        ).toBeInTheDocument()
    })
})
