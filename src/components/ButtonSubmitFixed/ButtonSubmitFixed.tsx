import { Button } from '@pzh-ui/components'

import { Container } from '../Container'

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
        <Container className="fixed bottom-4 left-0 right-0 w-full z-50 pointer-events-none">
            <div className="col-start-1 col-end-7">
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
        </Container>
    )
}

export default ButtonSubmitFixed
