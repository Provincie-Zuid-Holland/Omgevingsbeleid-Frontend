import { render } from '@testing-library/react';
import React from 'react';
import TableHeading from './TableHeading';

describe('TableHeading', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<TableHeading {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('TableHeading')).toBeTruthy();
    });
});
