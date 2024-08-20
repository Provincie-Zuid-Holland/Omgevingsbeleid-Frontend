import { Badge, Button, Heading, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import { Module } from '@/api/fetchers.schemas'

const ModuleTile = ({ Title, Description, Status, Module_ID }: Module) => (
    <Link
        to={`/muteer/modules/${Module_ID}`}
        data-testid="dashboard-module-tile">
        <div className="group rounded border border-pzh-gray-200 p-6">
            <div className="mb-4">
                <Heading level="3" size="m">
                    {Title}
                </Heading>
                <Text size="s" className="line-clamp-3">
                    {Description}
                </Text>
            </div>
            <div className="flex items-center justify-between">
                <Badge
                    text={Status?.Status.replace('-', ' ') || ''}
                    variant={
                        Status?.Status === 'Niet-actief' ? 'gray' : 'green'
                    }
                    upperCase={false}
                    solid={Status?.Status === 'Vastgesteld'}
                    className="whitespace-nowrap"
                />
                <Button
                    variant="link"
                    size="small"
                    className="text-pzh-green group-hover:text-pzh-green-dark group-hover:no-underline">
                    Bekijk module
                </Button>
            </div>
        </div>
    </Link>
)

export default ModuleTile
