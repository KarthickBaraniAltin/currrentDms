import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $getNodeByKey
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isParentElementRTL,
  $wrapNodes,
  $isAtNodeEnd,
  $getSelectionStyleValueForProperty,
  $patchStyleText
} from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from "@lexical/list";
import { createPortal } from "react-dom";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode
} from "@lexical/rich-text";
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages
} from "@lexical/code";

import styles from './ToolbarPlugin.module.css'
import DropDown, { DropDownItem } from "../../UI/DropDown/DropDown";
import ColorPicker from "../../UI/ColorPicker/ColorPicker";

const LowPriority = 1;

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "ul",
  "ol"
]);

const FONT_FAMILY_OPTIONS = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
];

const FONT_SIZE_OPTIONS = [
  ['10px', '10px'],
  ['11px', '11px'],
  ['12px', '12px'],
  ['13px', '13px'],
  ['14px', '14px'],
  ['15px', '15px'],
  ['16px', '16px'],
  ['17px', '17px'],
  ['18px', '18px'],
  ['19px', '19px'],
  ['20px', '20px'],
  ['21px', '21px'],
  ['22px', '22px'],
  ['23px', '23px'],
  ['24px', '24px'],
  ['25px', '25px'],
  ['26px', '26px'],
  ['27px', '27px'],
  ['28px', '28px'],
  ['29px', '29px'],
  ['30px', '30px'],
  ['31px', '31px'],
  ['32px', '32px'],
  ['33px', '33px']
];

const blockTypeToBlockName = {
  code: "Code Block",
  h1: "Large Heading",
  h2: "Small Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List"
};

function dropDownActiveClass(active) {
  if (active) return styles['active'] + ' ' + styles['dropdown-item-active'];
  else return '';
}

function Divider() {
  return <div className={styles["divider"]} />;
}

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }

    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority
      )
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className={styles["link-editor"]}>
      {isEditMode ? (
        <input
          ref={inputRef}
          className={styles["link-input"]}
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== "") {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className={styles["link-input"]}>
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className={styles["link-edit"]}
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

function Select({ onChange, className, options, value }) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown
}) {
  const dropDownRef = useRef(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event) => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  return (
    <div className={styles["dropdown"]} ref={dropDownRef}>
      <button className={styles["item"]} onClick={formatParagraph}>
        <span className={styles["icon"] + " " + styles["paragraph"]} />
        <span className={styles["text"]}>Normal</span>
        {blockType === "paragraph" && <span className={styles["active"]} />}
      </button>
      <button className={styles["item"]} onClick={formatLargeHeading}>
        <span className={styles["icon"] + " " + styles["large-heading"]} />
        <span className={styles["text"]}>Large Heading</span>
        {blockType === "h1" && <span className={styles["active"]} />}
      </button>
      <button className={styles["item"]} onClick={formatSmallHeading}>
        <span className={styles["icon"] + " " + styles["small-heading"]} />
        <span className={styles["text"]}>Small Heading</span>
        {blockType === "h2" && <span className={styles["active"]} />}
      </button>
      <button className={styles["item"]} onClick={formatBulletList}>
        <span className={styles["icon"] + " " + styles["bullet-list"]} />
        <span className={styles["text"]}>Bullet List</span>
        {blockType === "ul" && <span className={styles["active"]} />}
      </button>
      <button className={styles["item"]}  onClick={formatNumberedList}>
        <span className={styles["icon"] + " " + styles["numbered-list"]} />
        <span className={styles["text"]}>Numbered List</span>
        {blockType === "ol" && <span className={styles["active"]} />}
      </button>
      <button className={styles["item"]}  onClick={formatQuote}>
        <span className={styles["icon"] + " " + styles["quote"]} />
        <span className={styles["text"]}>Quote</span>
        {blockType === "quote" && <span className={styles["active"]} />}
      </button>
      <button className={styles["item"]}  onClick={formatCode}>
        <span className={styles["icon"] + " " + styles["code"]} />
        <span className={styles["text"]}>Code Block</span>
        {blockType === "code" && <span className={styles["active"]} />}
      </button>
    </div>
  );
}

const FontDropDown = ({ editor, value, style, disabled }) => {
  const handleClick = useCallback(
    (option) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style],
  );

  const buttonAriaLabel =
    style === 'font-family'
      ? 'Formatting options for font family'
      : 'Formatting options for font size';
  
      return (
        <DropDown
          disabled={disabled}
          buttonClassName={styles['toolbar-item'] + ' ' + style}
          buttonLabel={value}
          buttonIconClassName={
            style === 'font-family' ? styles['icon'] + ' ' + styles['block-type'] + ' ' + styles['font-family'] : ''
          }
          buttonAriaLabel={buttonAriaLabel}>
          {(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(
            ([option, text]) => (
              <DropDownItem
                className={`${styles['item']} ${dropDownActiveClass(value === option)} ${
                  style === 'font-size' ? styles['fontsize-item'] : ''
                }`}
                onClick={() => handleClick(option)}
                key={option}>
                <span className={styles["text"]}>{text}</span>
              </DropDownItem>
            ),
          )}
        </DropDown>
      );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(
    false
  );
  const [fontSize, setFontSize] = useState('15px')
  const [fontColor, setFontColor] = useState('#000')
  const [bgColor, setBgColor] = useState('#fff')
  const [fontFamily, setFontFamily] = useState('Arial')
  const [codeLanguage, setCodeLanguage] = useState("");
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000'),
      );
      setBgColor(
        $getSelectionStyleValueForProperty(selection, 'background-color', '#fff'),
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
      );
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const applyStyleText = useCallback(
    (styles) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [editor],
  );

  const codeLanguges = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    (e) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey]
  );

  const onFontColorSelect = useCallback(
    (value) => {
      applyStyleText({color: value});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value) => {
      applyStyleText({'background-color': value});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applyStyleText],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className={styles["toolbar"]} ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND);
        }}
        className={styles["toolbar-item"] + " " + styles["spaced"]}
        aria-label="Undo"
      >
        <i className={styles["format"] + " " + styles["undo"]} />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND);
        }}
        className={styles["toolbar-item"]}
        aria-label="Redo"
      >
        <i className={styles["format"] + " " + styles["redo"]} />
      </button>
      <Divider />
      {supportedBlockTypes.has(blockType) && (
        <>
          <button
            className={styles["toolbar-item"] + " " + styles["block-controls"]}
            onClick={() =>
              setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
            }
            aria-label="Formatting Options"
          >
            <span className={styles["icon"] + " " + styles["block-type"] + " " + styles[blockType]} />
            <span className={styles["text"]}>{blockTypeToBlockName[blockType]}</span>
            <i className={styles["chevron-down"]} />
          </button>
          {showBlockOptionsDropDown &&
            createPortal(
              <BlockOptionsDropdownList
                editor={editor}
                blockType={blockType}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
              />,
              document.body
            )}
          <Divider />
        </>
      )}
      {blockType === "code" ? (
        <>
          <Select
            className={styles["toolbar-item"] + " " + styles["code-language"]}
            onChange={onCodeLanguageSelect}
            options={codeLanguges}
            value={codeLanguage}
          />
          <i className={styles["chevron-down"] + " " + styles["inside"]} />
        </>
      ) : (
        <>
          <FontDropDown
            disabled={!isEditable}
            style={'font-family'}
            value={fontFamily}
            editor={editor}
          />
          <FontDropDown
            disabled={!isEditable}
            style={'font-size'}
            value={fontSize}
            editor={editor}
          />
          <ColorPicker
            disabled={!isEditable}
            buttonClassName={styles['toolbar-item'] + ' ' + styles['color-picker']}
            buttonAriaLabel="Formatting text color"
            buttonIconClassName={styles['icon'] + ' ' + styles['font-color']}
            color={fontColor}
            onChange={onFontColorSelect}
            title='text color'
          />
          <ColorPicker
            disabled={!isEditable}
            buttonClassName={styles["toolbar-item"] + " " + styles["color-picker"]}
            buttonAriaLabel="Formatting background color"
            buttonIconClassName={styles["icon"] + " " + styles["bg-color"]}
            color={bgColor}
            onChange={onBgColorSelect}
            title="bg color"
          />
          <Divider />
          <button
            disabled={!isEditable}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={styles["toolbar-item"] + " " + styles["spaced"] + " " + (isBold ? styles["active"] : "")}
            aria-label="Format Bold"
          >
            <i className={styles["format"] + " " + styles["bold"]} />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={styles["toolbar-item"] + " " + styles["spaced"] + " " + (isItalic ? styles["active"] : "")}
            aria-label="Format Italics"
          >
            <i className={styles["format"] + " " + styles["italic"]} />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={styles["toolbar-item"] + " " + styles["spaced"] + " " + (isUnderline ? styles["active"] : "")}
            aria-label="Format Underline"
          >
            <i className={styles["format"] + " " + styles["underline"]} />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
            className={
              styles["toolbar-item"] + " " +  styles["spaced"] + " " + (isStrikethrough ? styles["active"] : "")
            }
            aria-label="Format Strikethrough"
          >
            <i className={styles["format"] + " " + styles["strikethrough"]} />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }}
            className={styles["toolbar-item"] + " " + styles["spaced"] + " " + (isCode ? styles["active"] : "")}
            aria-label="Insert Code"
          >
            <i className={styles["format"] + " " + styles["code"]} />
          </button>
          <button
            disabled={!isEditable}
            onClick={insertLink}
            className={styles["toolbar-item"] + " " + styles["spaced"] + " " + (isLink ? styles["active"] : "")}
            aria-label="Insert Link"
          >
            <i className={styles["format"] + " " + styles["link"]} />
          </button>
          {isLink &&
            createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
          <Divider />
          <button
            disabled={!isEditable}
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
            }}
            className={styles["toolbar-item"] + " " + styles["spaced"]}
            aria-label="Left Align"
          >
            <i className={styles["format"] + " " +  styles["left-align"]} />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
            }}
            className={styles["toolbar-item"] + " " + styles["spaced"]}
            aria-label="Center Align"
          >
            <i className={styles["format"] + " " +  styles["center-align"]} />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
            }}
            className={styles["toolbar-item"] + " " + styles["spaced"]}
            aria-label="Right Align"
          >
            <i className={styles["format"] + " " + styles["right-align"]} />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
            }}
            className={styles["toolbar-item"]}
            aria-label="Justify Align"
          >
            <i className={styles["format"] + " " +  styles["justify-align"]} />
          </button>{" "}
        </>
      )}
    </div>
  );
}
