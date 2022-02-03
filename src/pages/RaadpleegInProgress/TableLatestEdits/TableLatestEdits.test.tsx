import { render } from '@testing-library/react';
import React from 'react';
import TableLatestEdits, { TableLatestEditsProps } from './TableLatestEdits';

describe('TableLatestEdits', () => {
    const defaultProps: TableLatestEditsProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<TableLatestEdits {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('TableLatestEdits')).toBeTruthy();
    });
});
