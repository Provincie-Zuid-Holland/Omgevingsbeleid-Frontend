import { render } from '@testing-library/react';
import React from 'react';
import StatusHistory from './StatusHistory';

describe('StatusHistory', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<StatusHistory {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('StatusHistory')).toBeTruthy();
    });
});
