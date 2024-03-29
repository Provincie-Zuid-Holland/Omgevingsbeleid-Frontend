import { Button } from '@pzh-ui/components'

/**
 * Displays a fixed placed submit button.
 */
interface ButtonSubmitFixedProps {
    disabled?: boolean
    isLoading?: boolean
    onCancel?: () => void
}

function ButtonSubmitFixed({
    disabled,
    isLoading,
    onCancel,
}: ButtonSubmitFixedProps) {
    return (
        <div className="grid sticky bottom-4 z-1 mt-10 pointer-events-none">
            <div className="col-span-6">
                <div className="flex justify-end">
                    <div className="bg-pzh-white p-2 pl-4 shadow-card rounded flex align-middle pointer-events-auto">
                        <Button
                            variant="link"
                            onPress={onCancel}
                            className="mr-4">
                            Annuleren
                        </Button>
                        <Button
                            variant="cta"
                            isDisabled={disabled}
                            isLoading={isLoading}
                            type="submit">
                            Opslaan
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ButtonSubmitFixed
