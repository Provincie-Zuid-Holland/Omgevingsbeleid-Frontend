import { SearchObject } from '@/api/fetchers.schemas'
import { ModelReturnTypeBasic } from '@/config/objects/types'

export interface StepProps {
    setExistingObject: (object?: SearchObject | ModelReturnTypeBasic) => void
    existingObject?: SearchObject | ModelReturnTypeBasic | null
    title?: string
}
