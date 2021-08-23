import { render } from '@testing-library/react';
import React from 'react';
import SortIcon from './SortIcon';

describe('SortIcon', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<SortIcon {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('SortIcon')).toBeTruthy();
    });
});
