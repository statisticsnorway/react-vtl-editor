import * as monaco from "monaco-editor";

const JOIN = {
  label: "join",
  detail: "[variable(, variable)*] { ... }",
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: {
    value: `[\${1:dataset}] {
$0
}
`
  },
  documentation: {
    value: "Join dataset"
  }
};

const AGGREGATE = {
  label: "aggregate",
  detail: "(sum|avg)(variable) (group by|along) variable(,variable)*",
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: {
    value: `\${1|sum,avg|}(\${2:dataset}) \${3|group by,along|} \${4:variable},
$0
`
  },
  documentation: {
    value: "Aggregation"
  }
};

const FILTER = {
  label: "filter",
  detail: "filter expression,",
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: {
    value: `filter $1,
$0
`
  },
  documentation: {
    value: "Filter clause"
  }
};

const KEEP = {
  label: "keep",
  detail: "keep variable(, variable)*",
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: {
    value: `keep \${1:variable},
$0
`
  },
  documentation: {
    value: "Keep/Drop"
  }
};

const DROP = {
  label: "drop",
  detail: "drop variable(, variable)*",
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: {
    value: `drop \${1:variable},
$0
`
  },
  documentation: {
    value: "Drop"
  }
};

const FOLD = {
  label: "fold",
  detail: "fold variable(, variable)* to identifier, measure",
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: {
    value: `fold \${1:variable} to \${2:identifier}, \${3:measure},
$0
`
  },
  documentation: {
    value: "Fold"
  }
};

const UNFOLD = {
  label: "unfold",
  detail: "unfold variable to \"\"(,\"\")",
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: {
    value: `unfold \${1:variable} to "$2",
$0
`
  },
  documentation: {
    value: "Unfold"
  }
};


class VtlSnippetProvider {

  /**
   * @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.completionitemprovider.html
   */
  provideCompletionItems(model, position, context, token) {
    // TODO: Check pos to avoid join inside a join.
    return [
      JOIN, FILTER, KEEP, DROP, AGGREGATE, FOLD, UNFOLD
    ]
  }

}

export default VtlSnippetProvider;