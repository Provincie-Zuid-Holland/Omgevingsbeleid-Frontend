import { render } from '@testing-library/react';
import React from 'react';
import RaadpleegObjectDetailSidebar from './RaadpleegObjectDetailSidebar';

describe('RaadpleegObjectDetailSidebar', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RaadpleegObjectDetailSidebar {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RaadpleegObjectDetailSidebar')).toBeTruthy();
    });
});
