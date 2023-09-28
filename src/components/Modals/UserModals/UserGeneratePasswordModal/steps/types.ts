import { User } from '@/api/fetchers.schemas'

export interface StepProps {
    handleClick: () => void
    handleClose: () => void
    newPassword: string | null
    user?: User
    isLoading: boolean
}
