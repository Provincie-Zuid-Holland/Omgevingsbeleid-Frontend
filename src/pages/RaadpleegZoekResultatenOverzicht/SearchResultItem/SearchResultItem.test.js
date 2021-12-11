import { render } from '@testing-library/react';
import React from 'react';
import SearchResultItem from './SearchResultItem';

describe('SearchResultItem', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<SearchResultItem {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('SearchResultItem')).toBeTruthy();
    });
});
