import { render } from '@testing-library/react';
import React from 'react';
import RevisionOverviewContainerRight, { RevisionOverviewContainerRightProps } from './RevisionOverviewContainerRight';

describe('RevisionOverviewContainerRight', () => {
    const defaultProps: RevisionOverviewContainerRightProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<RevisionOverviewContainerRight {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RevisionOverviewContainerRight')).toBeTruthy();
    });
});
