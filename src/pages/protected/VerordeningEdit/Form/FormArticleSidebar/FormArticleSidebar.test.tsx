import { render } from '@testing-library/react';
import React from 'react';
import FormArticleSidebar, { FormArticleSidebarProps } from './FormArticleSidebar';

describe('FormArticleSidebar', () => {
    const defaultProps: FormArticleSidebarProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FormArticleSidebar {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FormArticleSidebar')).toBeTruthy();
    });
});
