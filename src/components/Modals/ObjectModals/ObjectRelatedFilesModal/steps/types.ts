import { ObjectRelatedFileResponse } from '@/api/fetchers.schemas'
import { Model, ModelReturnType } from '@/config/objects/types'

export interface StepProps {
    model: Model
    objectData?: ModelReturnType
    userCanEdit: boolean
    selectedFile?: ObjectRelatedFileResponse
    setStep: (step: number) => void
    setSelectedFile: (file?: ObjectRelatedFileResponse) => void
    avgWarning: boolean
    setAvgWarning: (avgWarning: boolean) => void
}
