import { render } from '@testing-library/react';
import React from 'react';
import MuteerBeleidsmodulesOverview from './MuteerBeleidsmodulesOverview';

describe('MuteerBeleidsmodulesOverview', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<MuteerBeleidsmodulesOverview {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('MuteerBeleidsmodulesOverview')).toBeTruthy();
    });
});
