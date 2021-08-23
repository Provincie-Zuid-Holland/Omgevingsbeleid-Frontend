import { render } from '@testing-library/react';
import React from 'react';
import ModuleFilters from './ModuleFilters';

describe('ModuleFilters', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<ModuleFilters {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('ModuleFilters')).toBeTruthy();
    });
});
