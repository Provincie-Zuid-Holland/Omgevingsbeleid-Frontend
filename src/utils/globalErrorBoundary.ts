const globalErrorBoundary = { showBoundary: null } as {
    showBoundary: ((error: any) => void) | null
}

export default globalErrorBoundary
