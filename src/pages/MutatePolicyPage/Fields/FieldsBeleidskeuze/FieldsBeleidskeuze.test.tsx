import { render } from '@testing-library/react';
import React from 'react';
import FieldsBeleidskeuze, { FieldsBeleidskeuzeProps } from './FieldsBeleidskeuze';

describe('FieldsBeleidskeuze', () => {
    const defaultProps: FieldsBeleidskeuzeProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FieldsBeleidskeuze {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FieldsBeleidskeuze')).toBeTruthy();
    });
});
