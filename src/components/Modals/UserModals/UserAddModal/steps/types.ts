import { UserCreateResponse } from '@/api/fetchers.schemas'
import { UserFormProps } from '@/components/Users/UserForm/UserForm'

export interface StepProps {
    handleSubmit: UserFormProps['onSubmit']
    handleClose: () => void
    createdUser: UserCreateResponse | null
}
