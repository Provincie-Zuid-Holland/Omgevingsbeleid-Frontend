import { render } from '@testing-library/react';
import React from 'react';
import FormFieldContainerBeleidsmodules from './FormFieldContainerBeleidsmodules';

describe('FormFieldContainerBeleidsmodules', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<FormFieldContainerBeleidsmodules {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FormFieldContainerBeleidsmodules')).toBeTruthy();
    });
});
