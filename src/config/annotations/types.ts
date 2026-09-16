/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { Schema } from 'zod'

import { DynamicSection } from '../types'
import * as annotations from '.'

export interface ModelQueryKeys {
    [key: string]: (...args: any[]) => readonly unknown[]
}

export interface DynamicAnnotationBase<
    Q extends ModelQueryKeys = ModelQueryKeys,
> {
    defaults: {
        singular: AnnotationType
        singularReadable: string
        singularCapitalize: string
        plural: string
        pluralReadable: string
        pluralCapitalize: string
        prefixSingular: string
        prefixPlural: string
        prefixNewObject: string
        description?: string
        slugOverview?: string
        slugOverviewPublic?: boolean
        demonstrative?: string
        demonstrativeSingular?: string
        icon: React.ElementType
    }
    queryKeys?: Q
    validationSchema?: Schema
    dynamicSections: DynamicSection[]
    overview: {
        columns: {
            header: string
            accessorKey: string
        }[]
        defaultSortColumn: string
        idKey: string
    }
}

export interface AnnotationOverviewParams {
    limit: number
    offset: number
    sortColumn: string
    sortOrder: 'ASC' | 'DESC'
    query: string
    refreshKey: number
}

export interface AnnotationApi<TCreate = any, TEdit = any, TDetail = any> {
    overviewQueryKey: readonly unknown[]
    useOverview: (params: AnnotationOverviewParams) => {
        data?: {
            results: TDetail[]
            total?: number
        }
        isFetching?: boolean
    }
    useDetail: (
        id: string,
        enabled: boolean
    ) => {
        data?: TDetail
        isFetching?: boolean
        queryKey?: readonly unknown[]
    }
    useCreate: () => {
        save: (values: TCreate) => Promise<unknown>
    }
    useEdit: () => {
        save: (id: string, values: TEdit) => Promise<unknown>
    }
}

export type QueryHook<TArgs extends any[] = any[]> = <TData = any>(
    ...args: TArgs
) => UseQueryResult<TData> & {
    queryKey: readonly unknown[]
}

export type MutationHook<
    TData = any,
    TVariables = any,
    TArgs extends any[] = any[],
> = (...args: TArgs) => UseMutationResult<TData, any, TVariables>

export interface ModelFetchers {
    useDeleteAnnotations?: MutationHook | null
}

export type DynamicAnnotation<
    F extends ModelFetchers = ModelFetchers,
    A extends AnnotationApi = AnnotationApi,
    Q extends ModelQueryKeys = ModelQueryKeys,
> = DynamicAnnotationBase<Q> & {
    fetchers: F
    api: A
}

export type AnnotationType = keyof typeof annotations

export type Annotation = DynamicAnnotation
