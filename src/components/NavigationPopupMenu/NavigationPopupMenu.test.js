import { render } from '@testing-library/react';
import React from 'react';
import NavigationPopupMenu from './NavigationPopupMenu';

describe('NavigationPopupMenu', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<NavigationPopupMenu {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('NavigationPopupMenu')).toBeTruthy();
    });
});
