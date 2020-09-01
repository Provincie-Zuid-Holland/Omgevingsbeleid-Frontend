import { render } from '@testing-library/react';
import React from 'react';
import LeafletViewer from './LeafletViewer';

describe('LeafletViewer', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<LeafletViewer {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('LeafletViewer')).toBeTruthy();
    });
});
