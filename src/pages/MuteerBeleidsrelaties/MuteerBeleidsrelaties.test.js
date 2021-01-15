import { render } from '@testing-library/react';
import React from 'react';
import MuteerBeleidsrelaties from './MuteerBeleidsrelaties';

describe('MuteerBeleidsrelaties', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<MuteerBeleidsrelaties {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('MuteerBeleidsrelaties')).toBeTruthy();
    });
});
