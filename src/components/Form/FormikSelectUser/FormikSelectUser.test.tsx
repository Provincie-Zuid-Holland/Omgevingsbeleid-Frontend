import { FieldLabel } from '@pzh-ui/components'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import { Fragment } from 'react'

import FormikSelectUser, { FormikSelectUserProps } from './FormikSelectUser'

describe('FormikSelectUser', () => {
    const defaultProps: FormikSelectUserProps = {
        property: 'Eigenaar_1',
        filter: 'Ambtelijk opdrachtgever',
        options: [
            {
                value: '0001',
                label: 'user_1',
                role: 'role_1',
            },
            {
                value: '0002',
                label: 'user_2',
                role: 'Ambtelijk opdrachtgever',
            },
            {
                value: '0003',
                label: 'user_1',
                role: 'Ambtelijk opdrachtgever',
            },
        ],
    }

    const setup = (customProps?: FormikSelectUserProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <Formik
                initialValues={{}}
                enableReinitialize={true}
                onSubmit={() => {
                    null
                }}>
                <Fragment>
                    <FieldLabel name="Eigenaar_1" label="Eerste Eigenaar" />
                    <FormikSelectUser {...props} />
                </Fragment>
            </Formik>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Eerste Eigenaar')
        expect(element).toBeTruthy()
    })
})
