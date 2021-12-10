import { render } from '@testing-library/react';
import React from 'react';
import RaadpleegVerordeningSidebar from './RaadpleegVerordeningSidebar';

describe('RaadpleegVerordeningSidebar', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RaadpleegVerordeningSidebar {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RaadpleegVerordeningSidebar')).toBeTruthy();
    });
});
