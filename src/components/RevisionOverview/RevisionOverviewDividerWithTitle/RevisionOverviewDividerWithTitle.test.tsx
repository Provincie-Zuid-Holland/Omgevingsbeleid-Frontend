import { render } from '@testing-library/react';
import React from 'react';
import RevisionOverviewDividerWithTitle, { RevisionOverviewDividerWithTitleProps } from './RevisionOverviewDividerWithTitle';

describe('RevisionOverviewDividerWithTitle', () => {
    const defaultProps: RevisionOverviewDividerWithTitleProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<RevisionOverviewDividerWithTitle {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RevisionOverviewDividerWithTitle')).toBeTruthy();
    });
});
