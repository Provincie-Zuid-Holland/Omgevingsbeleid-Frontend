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
        <div className="pointer-events-none sticky bottom-4 z-[1] mt-10 grid">
            <div className="col-span-6">
                <div className="flex justify-end">
                    <div className="pointer-events-auto flex rounded bg-pzh-white p-2 pl-4 align-middle shadow-card">
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
