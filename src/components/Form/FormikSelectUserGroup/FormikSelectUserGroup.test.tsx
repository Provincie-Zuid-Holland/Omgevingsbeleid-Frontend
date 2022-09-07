import { render } from '@testing-library/react';
import React from 'react';
import FormikSelectUserGroup, { FormikSelectUserGroupProps } from './FormikSelectUserGroup';

describe('FormikSelectUserGroup', () => {
    const defaultProps: FormikSelectUserGroupProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FormikSelectUserGroup {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FormikSelectUserGroup')).toBeTruthy();
    });
});
