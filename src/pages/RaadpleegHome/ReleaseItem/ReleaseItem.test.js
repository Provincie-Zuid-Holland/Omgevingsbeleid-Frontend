import { render } from '@testing-library/react';
import React from 'react';
import ReleaseItem from './ReleaseItem';

describe('ReleaseItem', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<ReleaseItem {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('ReleaseItem')).toBeTruthy();
    });
});
