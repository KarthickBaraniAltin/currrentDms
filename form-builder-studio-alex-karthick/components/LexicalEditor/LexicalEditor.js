import Theme from "./Themes/Theme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./Plugins/ToolbarPlugin/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";

import ListMaxIndentLevelPlugin from "./Plugins/ListMaxIndentLevelPlugin/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./Plugins/CodeHighlightPlugin/CodeHighlightPlugin";
import AutoLinkPlugin from "./Plugins/AutoLinkPlugin/AutoLinkPlugin";

import styles from './LexicalEditor.module.css'
import clsx from "clsx";

function Placeholder() {
  return <div className={styles['editor-placeholder']}>Enter some rich text...</div>
}

export default function Editor({ value, name, onChange, className, readOnly = false }) {

  console.log('Readonly = ', readOnly)

  const initialValue = value ?? JSON.stringify({ "root": { "children": [{ "children": [{ "detail": 0, "format": 0, "mode": "normal", "style": "", "text": "", "type": "text", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "paragraph", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "root", "version": 1 } })

  const editorConfig = {
    // The editor theme
    theme: Theme,
    // Handling of errors during update
    onError(error) {
      throw error
    },
    // Any custom nodes go here
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode
    ],
    editable: !readOnly,
    editorState: initialValue,
  }

  const handleChange = (editorState, editor) => {
    editorState.read(() => {
      onChange(name, JSON.stringify(editor.getEditorState()))
    })
  }

  return (
    <>
      <div className={clsx(styles['lexical-body'], className)}>
          <LexicalComposer initialConfig={editorConfig}>
              <div className={styles['editor-container']}>
                  {!readOnly && <ToolbarPlugin />}
                  <div className={styles['editor-inner']}>
                      <RichTextPlugin
                          contentEditable={<ContentEditable className={styles['editor-input']} />}
                          placeholder={<Placeholder />}
                          ErrorBoundary={LexicalErrorBoundary}
                      />
                      <HistoryPlugin />
                      <OnChangePlugin onChange={(editorState, editor) => handleChange(editorState, editor)} />
                      <AutoFocusPlugin />
                      <CodeHighlightPlugin />
                      <ListPlugin />
                      <LinkPlugin />
                      <AutoLinkPlugin />
                      <ListMaxIndentLevelPlugin maxDepth={7} />
                      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                  </div>
              </div>
          </LexicalComposer>
      </div>
    </>
  );
}
