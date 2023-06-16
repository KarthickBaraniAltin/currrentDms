import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"


export const SubtitlePlugin = ({value}) => {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        if (value && editor) {
            editor.update(() => {
                const initialEditorState = editor.parseEditorState(value)
                editor.setEditorState(initialEditorState)
            })
        }
    }, [value, editor])
}

export default SubtitlePlugin