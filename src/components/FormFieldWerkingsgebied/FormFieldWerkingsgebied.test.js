import { render } from '@testing-library/react';
import React from 'react';
import FormFieldWerkingsgebied from './FormFieldWerkingsgebied';

describe('FormFieldWerkingsgebied', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<FormFieldWerkingsgebied {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FormFieldWerkingsgebied')).toBeTruthy();
    });
});
