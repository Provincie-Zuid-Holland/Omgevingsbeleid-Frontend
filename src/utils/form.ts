export const richTextEditorWithImageProps = {
    formats: ['bold', 'italic', 'underline', 'image', 'list', 'indent'],
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'bullet' }, { list: 'ordered' }, 'image'],
        ],
    },
}
