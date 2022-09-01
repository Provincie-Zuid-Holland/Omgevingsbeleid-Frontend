import { Button, Heading, Modal } from '@pzh-ui/components'

import { VerordeningStructureChild } from '@/types/verordening'

export interface VerordeningConfirmDeletionProps {
    show: boolean
    togglePopup: () => void
    removeSection: () => void
    section: VerordeningStructureChild
}

const VerordeningConfirmDeletion = ({
    show,
    togglePopup,
    removeSection,
    section,
}: VerordeningConfirmDeletionProps) => (
    <Modal
        maxWidth="max-w-sm"
        open={show}
        onClose={togglePopup}
        closeButton
        ariaLabel="Wachtwoord vergeten">
        <Heading level="3">
            Verwijder {section.Type} {section.Volgnummer}
        </Heading>

        <p className="py-1 text-pzh-blue-dark">
            Je staat op het punt om paragraaf 1 te verwijderen.{' '}
            {section.Children.length > 0 && (
                <div>
                    Op dit moment{' '}
                    {section.Children.length > 1
                        ? `vallen er ${section.Children.length} onderdelen`
                        : 'valt  er 1 onderdeel onder.'}{' '}
                    Je kunt pas {section.Type} {section.Volgnummer} verwijderen
                    zodra{' '}
                    {section.Children.length > 1
                        ? `de onderliggende
                        onderdelen verwijderd zijn.`
                        : 'het onderliggende onderdeel verwijderd is.'}{' '}
                </div>
            )}
        </p>
        <div className="flex items-center justify-between mt-5">
            <button
                className="text-sm underline transition-colors cursor-pointer text-pzh-blue hover:text-pzh-blue-dark"
                onClick={togglePopup}
                id="close-password-forget-popup"
                data-testid="close-password-forget-popup">
                Annuleren
            </button>
            <Button
                label={`Verwijder ${section.Type}`}
                variant="cta"
                id="wachtwoord-reset-button-mailto"
                data-testid="wachtwoord-reset-button-mailto"
                disabled={section.Children.length > 0}
                onClick={e => {
                    e.preventDefault()
                    removeSection()
                    togglePopup()
                }}
            />
        </div>
    </Modal>
)

export default VerordeningConfirmDeletion
