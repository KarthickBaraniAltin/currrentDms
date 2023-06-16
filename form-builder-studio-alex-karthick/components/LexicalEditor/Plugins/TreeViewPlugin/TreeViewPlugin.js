import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TreeView } from "@lexical/react/LexicalTreeView";

import styles from './TreeViewPlugin.module.css'

export default function TreeViewPlugin() {
  const [editor] = useLexicalComposerContext();
  return (
    <TreeView
      viewClassName={styles["tree-view-output"]}
      timeTravelPanelClassName={styles["debug-timetravel-panel"]}
      timeTravelButtonClassName={styles["debug-timetravel-button"]}
      timeTravelPanelSliderClassName={styles["debug-timetravel-panel-slider"]}
      timeTravelPanelButtonClassName={styles["debug-timetravel-panel-button"]}
      editor={editor}
    />
  );
}
