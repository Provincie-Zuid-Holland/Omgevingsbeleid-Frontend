import { render } from '@testing-library/react';
import React from 'react';
import MutatePolicyPage, { MutatePolicyPageProps } from './MutatePolicyPage';

describe('MutatePolicyPage', () => {
    const defaultProps: MutatePolicyPageProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<MutatePolicyPage {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('MutatePolicyPage')).toBeTruthy();
    });
});
