import { render } from '@testing-library/react';
import React from 'react';
import RelatiesKoppelingenVisualisatie from './RelatiesKoppelingenVisualisatie';

describe('RelatiesKoppelingenVisualisatie', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RelatiesKoppelingenVisualisatie {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RelatiesKoppelingenVisualisatie')).toBeTruthy();
    });
});
