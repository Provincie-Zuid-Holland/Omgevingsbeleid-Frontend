import { render } from '@testing-library/react';
import React from 'react';
import RevisionOverviewTitle, { RevisionOverviewTitleProps } from './RevisionOverviewTitle';

describe('RevisionOverviewTitle', () => {
    const defaultProps: RevisionOverviewTitleProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<RevisionOverviewTitle {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RevisionOverviewTitle')).toBeTruthy();
    });
});
