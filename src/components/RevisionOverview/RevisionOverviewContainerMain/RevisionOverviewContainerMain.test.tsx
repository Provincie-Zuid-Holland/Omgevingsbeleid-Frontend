import { render } from '@testing-library/react';
import React from 'react';
import RevisionOverviewContainerMain, { RevisionOverviewContainerMainProps } from './RevisionOverviewContainerMain';

describe('RevisionOverviewContainerMain', () => {
    const defaultProps: RevisionOverviewContainerMainProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<RevisionOverviewContainerMain {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RevisionOverviewContainerMain')).toBeTruthy();
    });
});
