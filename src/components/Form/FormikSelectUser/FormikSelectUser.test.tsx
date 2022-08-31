import { render } from '@testing-library/react'

import FormikSelectUser, { FormikSelectUserProps } from './FormikSelectUser'

describe('FormikSelectUser', () => {
    const defaultProps: FormikSelectUserProps = {
        property: 'Eigenaar_1',
        filter: 'Ambtelijk opdrachtgever',
        options: [],
    }

    it('should render', () => {
        const props = { ...defaultProps }
        const { queryByText } = render(<FormikSelectUser {...props} />)

        expect(queryByText('FormikSelectUser')).toBeTruthy()
    })
})
