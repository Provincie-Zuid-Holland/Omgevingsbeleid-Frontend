import { render } from '@testing-library/react';
import React from 'react';
import HorizontalDivider from './HorizontalDivider';

describe('HorizontalDivider', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<HorizontalDivider {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('HorizontalDivider')).toBeTruthy();
    });
});
