import {
    BackLink,
    BreadCrumbsList,
    BreadcrumbItem,
    Breadcrumbs as ProvidedBreadcrumbs,
} from '@pzh-ui/components'
import { Link } from 'react-router-dom'

interface BreadcrumbsProps {
    items: {
        name: string
        to?: string
    }[]
    className?: string
}

const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => (
    <ProvidedBreadcrumbs className={className}>
        <BreadCrumbsList className="hidden md:flex">
            {items.map((item, index) => (
                <BreadcrumbItem
                    key={`breadcrumb-${index}`}
                    isCurrent={index === items.length - 1}
                    asChild>
                    {item.to && index !== items.length - 1 ? (
                        <Link to={item.to}>{item.name}</Link>
                    ) : (
                        item.name
                    )}
                </BreadcrumbItem>
            ))}
        </BreadCrumbsList>
        <BackLink asChild className="block md:hidden">
            <Link to={items[items.length - 2].to || ''}>
                {items[items.length - 2].name}
            </Link>
        </BackLink>
    </ProvidedBreadcrumbs>
)

export default Breadcrumbs
