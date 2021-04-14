import { render } from '@testing-library/react';
import React from 'react';
import FormFieldWerkingsgebiedKoppeling from './FormFieldWerkingsgebiedKoppeling';

describe('FormFieldWerkingsgebiedKoppeling', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<FormFieldWerkingsgebiedKoppeling {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FormFieldWerkingsgebiedKoppeling')).toBeTruthy();
    });
});
