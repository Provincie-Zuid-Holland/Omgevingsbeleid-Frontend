import { render } from '@testing-library/react';
import React from 'react';
import FormFieldDate from './FormFieldDate';

describe('FormFieldDate', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<FormFieldDate {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FormFieldDate')).toBeTruthy();
    });
});
