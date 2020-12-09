import { render } from '@testing-library/react';
import React from 'react';
import SwitchToTabbladButton from './SwitchToTabbladButton';

describe('SwitchToTabbladButton', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<SwitchToTabbladButton {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('SwitchToTabbladButton')).toBeTruthy();
    });
});
