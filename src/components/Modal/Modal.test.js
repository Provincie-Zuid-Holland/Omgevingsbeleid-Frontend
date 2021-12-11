import { render } from '@testing-library/react';
import React from 'react';
import Modal from './Modal';

describe('Modal', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Modal {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Modal')).toBeTruthy();
    });
});
