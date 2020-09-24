import { render } from '@testing-library/react';
import React from 'react';
import MuteerUniversalObjectDetailWithStatuses from './MuteerUniversalObjectDetailWithStatuses';

describe('MuteerUniversalObjectDetailWithStatuses', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<MuteerUniversalObjectDetailWithStatuses {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('MuteerUniversalObjectDetailWithStatuses')).toBeTruthy();
    });
});
