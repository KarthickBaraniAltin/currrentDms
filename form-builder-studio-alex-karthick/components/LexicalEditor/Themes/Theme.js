import styles from './Theme.module.css'

const theme = {
    ltr: styles["ltr"],
    rtl: styles["rtl"],
    placeholder: styles["editor-placeholder"],
    paragraph: styles["editor-paragraph"],
    quote: styles["editor-quote"],
    heading: {
      h1: styles["editor-heading-h1"],
      h2: styles["editor-heading-h2"],
      h3: "editor-heading-h3", // not implemented 
      h4: "editor-heading-h4", // not implemented
      h5: "editor-heading-h5"  // not implemented
    },
    list: {
      nested: {
        listitem: styles["editor-nested-listitem"]
      },
      ol: styles["editor-list-ol"],
      ul: styles["editor-list-ul"],
      listitem: styles["editor-listitem"]
    },
    image: "editor-image", // not implemented
    link: styles["editor-link"],
    text: {
      bold: styles["editor-text-bold"],
      italic: styles["editor-text-italic"],
      overflowed: styles["editor-text-overflowed"], // not implemented
      hashtag: styles["editor-text-hashtag"], // not implemented
      underline: styles["editor-text-underline"],
      strikethrough: styles["editor-text-strikethrough"],
      underlineStrikethrough: styles["editor-text-underlineStrikethrough"],
      code: styles["editor-text-code"]
    },
    code: styles["editor-code"],
    codeHighlight: {
      atrule: styles["editor-tokenAttr"],
      attr: styles["editor-tokenAttr"],
      boolean: styles["editor-tokenProperty"],
      builtin: styles["editor-tokenSelector"],
      cdata: styles["editor-tokenComment"],
      char: styles["editor-tokenSelector"],
      class: styles["editor-tokenFunction"],
      "class-name": styles["editor-tokenFunction"],
      comment: styles["editor-tokenComment"],
      constant: styles["editor-tokenProperty"],
      deleted: styles["editor-tokenProperty"],
      doctype: styles["editor-tokenComment"],
      entity: styles["editor-tokenOperator"],
      function: styles["editor-tokenFunction"],
      important: styles["editor-tokenVariable"],
      inserted: styles["editor-tokenSelector"],
      keyword: styles["editor-tokenAttr"],
      namespace: styles["editor-tokenVariable"],
      number: styles["editor-tokenProperty"],
      operator: styles["editor-tokenOperator"],
      prolog: styles["editor-tokenComment"],
      property: styles["editor-tokenProperty"],
      punctuation: styles["editor-tokenPunctuation"],
      regex: styles["editor-tokenVariable"],
      selector: styles["editor-tokenSelector"],
      string: styles["editor-tokenSelector"],
      symbol: styles["editor-tokenProperty"],
      tag: styles["editor-tokenProperty"],
      url: styles["editor-tokenOperator"],
      variable: styles["editor-tokenVariable"]
    }
  }
  
  export default theme
  