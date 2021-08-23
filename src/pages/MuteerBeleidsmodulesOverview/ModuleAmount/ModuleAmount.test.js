import { render } from '@testing-library/react';
import React from 'react';
import ModuleAmount from './ModuleAmount';

describe('ModuleAmount', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<ModuleAmount {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('ModuleAmount')).toBeTruthy();
    });
});
