import { render } from '@testing-library/react';
import React from 'react';
import FeedbackComponent from './FeedbackComponent';

describe('FeedbackComponent', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<FeedbackComponent {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FeedbackComponent')).toBeTruthy();
    });
});
