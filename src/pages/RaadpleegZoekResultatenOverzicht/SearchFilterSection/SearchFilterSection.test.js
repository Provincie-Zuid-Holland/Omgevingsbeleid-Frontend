import { render } from '@testing-library/react';
import React from 'react';
import SearchFilterSection from './SearchFilterSection';

describe('SearchFilterSection', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<SearchFilterSection {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('SearchFilterSection')).toBeTruthy();
    });
});
