import { render } from '@testing-library/react';
import React from 'react';
import FormFieldRelatieKoppeling from './FormFieldRelatieKoppeling';

describe('FormFieldRelatieKoppeling', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<FormFieldRelatieKoppeling {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FormFieldRelatieKoppeling')).toBeTruthy();
    });
});
