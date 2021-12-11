import { render } from '@testing-library/react';
import React from 'react';
import FilterItem from './FilterItem';

describe('FilterItem', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<FilterItem {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FilterItem')).toBeTruthy();
    });
});
