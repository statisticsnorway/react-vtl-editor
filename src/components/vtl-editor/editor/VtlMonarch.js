export const VtlMonarch = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: 'invalid',

  keywords: [

    // Math
    "ln", "mod", "isnull", "upper", "nroot", "sqrt", "exp", "ceil",
    "power", "floor", "rtrim", "abs", "round", "log",

    "nvl",

    'join',

    // Strings
    "trim", "ltrim", "lower", "substr", "trunc",

    // Not standard.
    "date_from_string", "string_from_number",

    "get", "put",

    "union", "hierarchy", "check", "sum", "avg",
  ],

  typeKeywords: [
    "identifier", "measure", "attribute"
  ],

  operators: [
    ':=', '>', '<', 'not', 'is not null', 'is null', '||', '=', '<=', '>=', '<>',
    'and', 'or', 'xor', '+', '-', '*', '/', "if", "then", "else", "elseif", '[', ']',
    "in", "outer", "inner", "fold", "cross", "on", "rename", "to", "do", "done", "foreach",
    "group by", "keep", "drop", "unfold", "along", "filter", "as",
  ],

  constants: ["null", "true", "false"],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  // C# style strings
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-z_$][\w$]*/, {
        cases: {
          '@typeKeywords': 'keyword',
          '@keywords': 'keyword',
          '@constants': 'constant',
          '@default': 'identifier'
        }
      }],

      // whitespace
      {include: '@whitespace'},

      // delimiters and operators
      //[/[{}()\[\]]/, '@brackets'],
      //[/[<>](?!@symbols)/, '@brackets'],
      //[/@symbols/, { cases: { '@operators': 'operator',
      //                        '@default'  : '' } } ],

      // @ annotations.
      // As an example, we emit a debugging log message on these tokens.
      // Note: message are supressed during the first load -- change some lines to see them.
      //[/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],

      // numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],

      // delimiter: after number because of .\d floats
      [/[,]/, 'delimiter'],

      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
      [/"/, {token: 'string.quote', bracket: '@open', next: '@string'}],

      // characters
      [/'[^\\']'/, 'string'],
      [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
      [/'/, 'string.invalid']
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\/\*/, 'comment', '@push'],    // nested comment
      ["\\*/", 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, {token: 'string.quote', bracket: '@close', next: '@pop'}]
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],
  },
};
