import { render } from '@testing-library/react';
import React from 'react';
import TableRow from './TableRow';

describe('TableRow', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<TableRow {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('TableRow')).toBeTruthy();
    });
});
