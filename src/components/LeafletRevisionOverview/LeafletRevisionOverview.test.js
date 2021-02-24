import { render } from '@testing-library/react';
import React from 'react';
import LeafletRevisionOverview from './LeafletRevisionOverview';

describe('LeafletRevisionOverview', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<LeafletRevisionOverview {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('LeafletRevisionOverview')).toBeTruthy();
    });
});
