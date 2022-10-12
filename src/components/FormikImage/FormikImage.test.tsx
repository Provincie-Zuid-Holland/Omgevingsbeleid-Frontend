import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Formik } from 'formik'

import FormikImage, { FormikImageProps } from './FormikImage'

describe('FormikImage', () => {
    const defaultProps = {
        name: 'Afbeelding',
        label: 'Afbeelding van gebied',
    }

    const setup = (customProps?: FormikImageProps) => {
        const props = { ...defaultProps, ...customProps }
        const handleSubmit = jest.fn()
        render(
            <Formik
                initialValues={{
                    Afbeelding: null,
                }}
                onSubmit={handleSubmit}>
                <FormikImage {...props} />
            </Formik>
        )
    }

    it('Component renders', () => {
        setup()

        expect(screen.getByText('Afbeelding van gebied')).toBeTruthy()
        expect(screen.getByText('blader door je bestanden')).toBeTruthy()
    })
})
