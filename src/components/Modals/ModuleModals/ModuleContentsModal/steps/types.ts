import { GenericObjectShort, ModuleObjectShort } from '@/api/fetchers.schemas'

export interface StepProps {
    setExistingObject: (object?: GenericObjectShort | ModuleObjectShort) => void
    existingObject?: GenericObjectShort | ModuleObjectShort | null
    title?: string
}
