import { render } from '@testing-library/react';
import React from 'react';
import ContainerViewFieldsBeleidsprestatie from './ContainerViewFieldsBeleidsprestatie';

describe('ContainerViewFieldsBeleidsprestatie', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<ContainerViewFieldsBeleidsprestatie {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('ContainerViewFieldsBeleidsprestatie')).toBeTruthy();
    });
});
