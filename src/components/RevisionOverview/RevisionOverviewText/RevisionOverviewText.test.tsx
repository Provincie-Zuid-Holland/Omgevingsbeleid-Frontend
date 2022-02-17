import { render } from '@testing-library/react';
import React from 'react';
import RevisionOverviewText, { RevisionOverviewTextProps } from './RevisionOverviewText';

describe('RevisionOverviewText', () => {
    const defaultProps: RevisionOverviewTextProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<RevisionOverviewText {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RevisionOverviewText')).toBeTruthy();
    });
});
