import { render } from '@testing-library/react';
import React from 'react';
import RevisionOverviewWerkingsgebied, { RevisionOverviewWerkingsgebiedProps } from './RevisionOverviewWerkingsgebied';

describe('RevisionOverviewWerkingsgebied', () => {
    const defaultProps: RevisionOverviewWerkingsgebiedProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<RevisionOverviewWerkingsgebied {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RevisionOverviewWerkingsgebied')).toBeTruthy();
    });
});
