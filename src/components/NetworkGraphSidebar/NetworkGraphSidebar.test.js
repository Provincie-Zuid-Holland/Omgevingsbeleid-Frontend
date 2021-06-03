import { render } from '@testing-library/react';
import React from 'react';
import NetworkGraphSidebar from './NetworkGraphSidebar';

describe('NetworkGraphSidebar', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<NetworkGraphSidebar {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('NetworkGraphSidebar')).toBeTruthy();
    });
});
