import { render } from '@testing-library/react';
import React from 'react';
import TableOfContents from './TableOfContents';

describe('TableOfContents', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<TableOfContents {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('TableOfContents')).toBeTruthy();
    });
});
