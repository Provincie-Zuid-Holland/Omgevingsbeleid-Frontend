import { render } from '@testing-library/react';
import React from 'react';
import ViewFieldInnerHTML from './ViewFieldInnerHTML';

describe('ViewFieldInnerHTML', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<ViewFieldInnerHTML {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('ViewFieldInnerHTML')).toBeTruthy();
    });
});
