import { render } from '@testing-library/react';
import React from 'react';
import Button from './Button';

describe('Button', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Button {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Button')).toBeTruthy();
    });
});
