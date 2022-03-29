import { render } from '@testing-library/react';
import React from 'react';
import FieldsBeleidsdoel, { FieldsBeleidsdoelProps } from './FieldsBeleidsdoel';

describe('FieldsBeleidsdoel', () => {
    const defaultProps: FieldsBeleidsdoelProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FieldsBeleidsdoel {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FieldsBeleidsdoel')).toBeTruthy();
    });
});
