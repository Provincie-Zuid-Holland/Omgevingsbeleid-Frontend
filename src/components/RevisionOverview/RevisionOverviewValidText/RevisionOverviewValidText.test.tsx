import { render } from '@testing-library/react';
import React from 'react';
import RevisionOverviewValidText, { RevisionOverviewValidTextProps } from './RevisionOverviewValidText';

describe('RevisionOverviewValidText', () => {
    const defaultProps: RevisionOverviewValidTextProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<RevisionOverviewValidText {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RevisionOverviewValidText')).toBeTruthy();
    });
});
