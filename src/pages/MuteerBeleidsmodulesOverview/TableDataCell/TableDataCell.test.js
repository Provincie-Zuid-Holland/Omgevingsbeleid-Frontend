import { render } from '@testing-library/react';
import React from 'react';
import TableDataCell from './TableDataCell';

describe('TableDataCell', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<TableDataCell {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('TableDataCell')).toBeTruthy();
    });
});
