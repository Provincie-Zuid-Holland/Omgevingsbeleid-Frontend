import { Button } from '@pzh-ui/components'
import { Check, FileWord, Xmark } from '@pzh-ui/icons'

interface ModuleVersion {
    version: number
    status: string
    type: string
    purpose: string
    uploadDate?: string
    isPending?: boolean
}

interface ModuleVersionTableProps {
    versions: ModuleVersion[]
}

const ModuleVersionTable = ({ versions }: ModuleVersionTableProps) => (
    <table className="mb-6 w-full table-auto text-left text-s">
        <thead className="h-8 border-b border-pzh-gray-400 font-bold text-pzh-blue-500">
            <tr>
                <th className="pl-2">Versie</th>
                <th>Gebaseerd op Modulestatus</th>
                <th>Type besluit</th>
                <th>Doel</th>
                <th className="pr-2">Actie</th>
            </tr>
        </thead>
        <tbody>
            {versions.map(
                ({ version, status, type, purpose, uploadDate, isPending }) => (
                    <tr className="h-14 odd:bg-pzh-gray-100">
                        <td className="pl-2">{version}</td>
                        <td>{status}</td>
                        <td>{type}</td>
                        <td>{purpose}</td>
                        <td className="pr-2">
                            <div className="flex items-center gap-4">
                                {uploadDate ? (
                                    `Levering succesvol geüpload op ${uploadDate}`
                                ) : isPending ? (
                                    <>
                                        <Button
                                            variant="link"
                                            size="small"
                                            className="text-pzh-green-500">
                                            Download levering (voor publicatie)
                                        </Button>
                                        <Button
                                            variant="link"
                                            size="small"
                                            className="text-pzh-green-500">
                                            Upload rapport
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button
                                                icon={Check}
                                                size="small"
                                                iconSize={16}
                                            />
                                            <Button
                                                icon={Xmark}
                                                size="small"
                                                iconSize={16}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="link"
                                            size="small"
                                            className="text-pzh-green-500">
                                            Bewerken
                                        </Button>
                                        <Button
                                            variant="link"
                                            size="small"
                                            className="text-pzh-green-500">
                                            Maak levering
                                        </Button>
                                    </>
                                )}
                                <Button
                                    size="small"
                                    icon={FileWord}
                                    iconSize={16}
                                    className="ml-auto"
                                />
                            </div>
                        </td>
                    </tr>
                )
            )}
        </tbody>
    </table>
)

export default ModuleVersionTable
