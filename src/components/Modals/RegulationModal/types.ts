export interface RegulationModalActions {
    isOpen: boolean
    initialStep?: number
    initialValues: {
        items?: string[]
    }
}
