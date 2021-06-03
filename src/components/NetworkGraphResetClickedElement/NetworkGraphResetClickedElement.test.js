import { render } from '@testing-library/react';
import React from 'react';
import NetworkGraphResetClickedElement from './NetworkGraphResetClickedElement';

describe('NetworkGraphResetClickedElement', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<NetworkGraphResetClickedElement {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('NetworkGraphResetClickedElement')).toBeTruthy();
    });
});
