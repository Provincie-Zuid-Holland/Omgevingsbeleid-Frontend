import { render } from '@testing-library/react';
import React from 'react';
import NetworkGraphTooltip from './NetworkGraphTooltip';

describe('NetworkGraphTooltip', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<NetworkGraphTooltip {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('NetworkGraphTooltip')).toBeTruthy();
    });
});
