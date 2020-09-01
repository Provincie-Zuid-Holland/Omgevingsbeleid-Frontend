import { render } from '@testing-library/react';
import React from 'react';
import RelatiesKoppelingenTekstueel from './RelatiesKoppelingenTekstueel';

describe('RelatiesKoppelingenTekstueel', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RelatiesKoppelingenTekstueel {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RelatiesKoppelingenTekstueel')).toBeTruthy();
    });
});
