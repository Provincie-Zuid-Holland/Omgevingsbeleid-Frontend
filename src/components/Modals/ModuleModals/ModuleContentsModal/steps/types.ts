import { ModuleObjectShort, SearchObject } from '@/api/fetchers.schemas'

export interface StepProps {
    setExistingObject: (object?: SearchObject | ModuleObjectShort) => void
    existingObject?: SearchObject | ModuleObjectShort | null
    title?: string
}
