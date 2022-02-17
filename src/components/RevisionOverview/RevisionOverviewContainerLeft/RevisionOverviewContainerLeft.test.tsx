import { render } from '@testing-library/react';
import React from 'react';
import RevisionOverviewContainerLeft, { RevisionOverviewContainerLeftProps } from './RevisionOverviewContainerLeft';

describe('RevisionOverviewContainerLeft', () => {
    const defaultProps: RevisionOverviewContainerLeftProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<RevisionOverviewContainerLeft {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RevisionOverviewContainerLeft')).toBeTruthy();
    });
});
