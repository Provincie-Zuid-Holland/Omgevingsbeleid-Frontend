// Types to help Typescript understand the ViewTransition API

interface Document {
    startViewTransition(
        setupPromise: () => Promise<void> | void
    ): ViewTransition
}
