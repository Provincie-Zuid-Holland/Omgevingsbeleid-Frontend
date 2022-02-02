import {
    BeleidsmodulesRead,
    BeleidsmodulesReadBeleidskeuzesItem,
    BeleidsmodulesReadMaatregelenItem,
} from '@/api/fetchers.schemas'

interface ModuleAmountProps {
    currentBeleidsmodule?: BeleidsmodulesRead
    policies?: (
        | BeleidsmodulesReadBeleidskeuzesItem
        | BeleidsmodulesReadMaatregelenItem
    )[]
}

function ModuleAmount({ currentBeleidsmodule, policies }: ModuleAmountProps) {
    if (!currentBeleidsmodule || !policies) return null

    return (
        <div className="px-6">
            <div
                className="block w-full px-3 py-2 my-4 rounded-md bg-pzh-blue-dark"
                style={{
                    backgroundColor: 'RGBA(39, 174, 96, 0.1)',
                }}>
                <span>
                    In de module '{currentBeleidsmodule.Titel}'{' '}
                    {policies.length === 1 ? 'zit' : 'zitten'}{' '}
                </span>
                <span className="font-bold">
                    {policies.length}{' '}
                    {policies.length === 1 ? 'beleidsstuk' : 'beleidsstukken'}
                </span>
            </div>
        </div>
    )
}

export default ModuleAmount
