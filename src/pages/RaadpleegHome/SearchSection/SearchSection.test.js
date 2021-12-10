import { render } from '@testing-library/react';
import React from 'react';
import SearchSection from './SearchSection';

describe('SearchSection', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<SearchSection {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('SearchSection')).toBeTruthy();
    });
});
