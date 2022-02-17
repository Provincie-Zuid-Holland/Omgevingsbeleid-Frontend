import { render } from '@testing-library/react';
import React from 'react';
import RevisionOverviewChangeContainer, { RevisionOverviewChangeContainerProps } from './RevisionOverviewChangeContainer';

describe('RevisionOverviewChangeContainer', () => {
    const defaultProps: RevisionOverviewChangeContainerProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<RevisionOverviewChangeContainer {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RevisionOverviewChangeContainer')).toBeTruthy();
    });
});
