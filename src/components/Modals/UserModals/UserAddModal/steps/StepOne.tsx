import { Heading } from '@pzh-ui/components'

import UserForm from '@/components/Users/UserForm'
import { EMPTY_SCHEMA_ADD_USER } from '@/validation/user'

import { UserSchema } from '@/components/Users/UserForm/UserForm'
import { StepProps } from './types'

export const StepOne = ({ handleSubmit, handleClose }: StepProps) => (
    <>
        <Heading level="2" size="xl">
            Gebruiker toevoegen
        </Heading>
        <UserForm
            initialValues={EMPTY_SCHEMA_ADD_USER as UserSchema}
            onSubmit={handleSubmit}
            handleClose={handleClose}
            submitText="Gebruiker toevoegen"
        />
    </>
)
