import { $generateHtmlFromNodes } from "@lexical/html"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"


export const HtmlConverterPlugin = () => {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        editor.update(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);
        })
    }, [editor])

    return null
}

export default HtmlConverterPlugin