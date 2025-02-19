export interface StepProps {
    data: {
        environments: {
            options: {
                label: string
                value: string
            }[]
            isLoading: boolean
        }
        acts: {
            options: {
                label: string
                value: string
            }[]
            isLoading: boolean
        }
        templates: {
            options: {
                label: string
                value: string
            }[]
            isLoading: boolean
        }
        moduleStatus: {
            options: {
                label: string
                value: number
            }[]
            isLoading: boolean
        }
    }
}
