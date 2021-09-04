import { render } from '@testing-library/react';
import React from 'react';
import Heading from './Heading';

describe('Heading', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Heading {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Heading')).toBeTruthy();
    });
});
