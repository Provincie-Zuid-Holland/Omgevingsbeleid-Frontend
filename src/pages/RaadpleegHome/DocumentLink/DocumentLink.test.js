import { render } from '@testing-library/react';
import React from 'react';
import DocumentLink from './DocumentLink';

describe('DocumentLink', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<DocumentLink {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('DocumentLink')).toBeTruthy();
    });
});
