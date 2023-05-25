import { SearchObject } from '@/api/fetchers.schemas'

export interface StepProps {
    setExistingObject: (object?: SearchObject) => void
    existingObject?: SearchObject
    title?: string
}
