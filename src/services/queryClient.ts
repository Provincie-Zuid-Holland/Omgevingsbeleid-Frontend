import { QueryClient } from '@tanstack/react-query'

import { toastNotification } from '@/utils/toastNotification'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            staleTime: 1000 * 60 * 60 * 24,
            retry: false,
            retryOnMount: true,
        },
        mutations: {
            onError: () => toastNotification('error'),
        },
    },
})
