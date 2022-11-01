import React, { Fragment } from 'react'

import { Container } from '@/components/Container'
import { LoaderCard } from '@/components/Loader'

export interface VerordeningEditLoaderProps {}

function VerordeningEditLoader({}: VerordeningEditLoaderProps) {
    return (
        <Fragment>
            <Container>
                <div className="col-span-4 mt-6 mb-4">
                    <LoaderCard height="150" mb="mb-2" />
                </div>
            </Container>
            <Container>
                <div className="flex-row items-center justify-center col-span-4">
                    <LoaderCard mb="mb-2" />
                    <LoaderCard mb="mb-2" />
                    <LoaderCard mb="mb-2" />
                    <LoaderCard mb="mb-2" />
                    <LoaderCard mb="mb-2" />
                </div>
                <div className="col-span-2">
                    <LoaderCard mb="mb-2" />
                    <LoaderCard mb="mb-2" />
                </div>
            </Container>
        </Fragment>
    )
}

export default VerordeningEditLoader
