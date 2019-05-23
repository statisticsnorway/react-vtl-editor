import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from "react-monaco-editor";
import Axios from "axios";
import * as ReactDOM from "react-dom";

import './Editor.css'
import {VtlMonarch} from "./VtlMonarch";
import InspectorWidget from "./inspect/InspectorWidget";
import VtlSnippetProvider from "./VtlSnippets";

export const exampleVtlWithError = `

/* Comment */
ssbDataset := get("http://data.ssb.no/api/v0/dataset/1102")

dode := [ssbDataset] {
	fold Dode3 to Type, Value
}

folketallet := [ssbDataset] {
	fold Folketallet11 to Type, Value
}

/* Undefined */
syntaxError := [ssbDatasettypo] {
	fold Folketallet11 to Type, Value
}

/* Type error */
syntaxError := [ssbDataset] {
	test := "string" + 1
}

test := foreach Tid in dode, folketallet do
	result := [dode, folketallet] {
        filter true
    }
done
`;

export const exampleVtl = `ssbDataset := get("http://data.ssb.no/api/v0/dataset/1102")

dode := [ssbDataset] {
	fold Dode3 to Type, Value
}

folketallet := [ssbDataset] {
	fold Folketallet11 to Type, Value
}

test := foreach Tid in dode, folketallet do
	result := [dode, folketallet] {
        filter true
    }
done
`;

export const exampleSymbols = [
  {
    "name": "ssbDataset",
    "id": "ssbDataset:1:1:0:10",
    "startLineNumber": 1,
    "endLineNumber": 1,
    "startColumn": 1,
    "endColumn": 11
  },
  {
    "name": "dode",
    "id": "dode:3:3:0:4",
    "startLineNumber": 3,
    "endLineNumber": 3,
    "startColumn": 1,
    "endColumn": 5
  },
  {
    "name": "folketallet",
    "id": "folketallet:7:7:0:11",
    "startLineNumber": 7,
    "endLineNumber": 7,
    "startColumn": 1,
    "endColumn": 12
  },
  {
    "name": "test",
    "id": "test:11:11:0:4",
    "startLineNumber": 11,
    "endLineNumber": 11,
    "startColumn": 1,
    "endColumn": 5
  }
];

export const exampleErrors = [{
  "startLineNumber": 15,
  "endLineNumber": 15,
  "startColumn": 17,
  "endColumn": 31,
  "message": "undefined variable ssbDatasettypo in <unknown> at line number 14 at column number 16",
  "severity": "Error"
}, {
  "startLineNumber": 21,
  "endLineNumber": 21,
  "startColumn": 10,
  "endColumn": 18,
  "message": "invalid type VTLString, expected VTLNumber in <unknown> at line number 20 at column number 9",
  "severity": "Error"
}];

const axios = Axios.create({withCredentials: true});

const LANGUAGE = 'vtl';

/**
 * Create an overlay over a zone. Uses the trick explained
 * at https://github.com/Microsoft/monaco-editor/issues/373
 */
class ZoneOverlay {

  constructor(lineNumber, heightInLines, id, overlayDom) {

    this.overlayDom = overlayDom || document.createElement('div');
    this.overlayDom.id = id;
    this.overlayDom.style.width = '100%';
    this.overlayDom.className = "zone-overlay";
    this.widgetId = id;

    // Used only to compute the position.
    this.domNode = document.createElement('div');
    this.domNode.id = 'zone-' + id;
    this.domNode.style.width = '100%';
    this.domNode.style.position = 'absolute';
    this.afterLineNumber = lineNumber;
    this.heightInLines = heightInLines;
  }

  remove() {
    if (this.onRemove) {
      this.onRemove(this);
    }
  }

  /**
   * Widget interface.
   */
  getId() {
    return this.widgetId;
  }

  /**
   * Widget interface.
   */
  getDomNode() {
    return this.overlayDom;
  }

  /**
   * Widget interface.
   */
  getPosition() {
    return null;
  }

  onDomNodeTop(topPos) {
    this.overlayDom.style.top = topPos + "px";
  }

  onComputedHeight(height) {
    this.overlayDom.style.height = height + "px";
  }
}


/**
 * Vtl editor based on the Monaco editor.
 *
 * Takes in a list of markers:
 * {startLineNumber: number,
      startColumn: 5,
      endLineNumber: 8,
      endColumn: 9,
      message: "a message",
      severity: monaco.MarkerSeverity.Warning}
 */
class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openSymbols: []
    }
  }

  editorWillMount(monaco) {
    // Setup monarch vtl language definition.
    monaco.languages.register({id: LANGUAGE});
    monaco.languages.setMonarchTokensProvider(LANGUAGE, VtlMonarch);

    this.completionProvider = monaco.languages.registerCompletionItemProvider(
      LANGUAGE, new VtlSnippetProvider());

    this.linkProvider = monaco.languages.registerLinkProvider(LANGUAGE, {
      provideLinks: (model, token) => {
        return this.props.symbols.map(symbol => {
          return {
            range: {
              ...symbol
            },
            link: symbol.id
          }
        });
      }, resolveLink: (link, token) => {
        this.toggleData(link);
        // TODO: Fix this.
        //return { url: "javascript:void(0)"};
      }
    });
  }

  editorDidMount(editor, monaco) {
    this.monacoRef = monaco;
    this.editorRef = editor;
  }

  componentDidMount() {
    this.updateMarkers(this.props.errors);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.updateMarkers(this.props.errors);
  }

  updateMarkers(markers) {
    let monaco = this.monacoRef;
    let editor = this.editorRef;

    // https://microsoft.github.io/monaco-editor/api/modules/monaco.editor.html#setmodelmarkers
    // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.imarkerdata.html
    monaco.editor.setModelMarkers(editor.getModel(), 'test', markers);
  }


  componentWillUnmount() {
    try {
      this.completionProvider.dispose();
    } catch (e) {
      console.warn('unable to dispose the completion provider')
    }
    try {
      this.linkProvider.dispose();
    } catch (e) {
      console.warn('unable to dispose the link provider')
    }
  }

  setupSymbolLinkProvider() {

  }

  toggleData(link) {

    // TODO: Use children the way react router does.
    const found = this.state.openSymbols.find(symbol => {
      return symbol.widgetId === link.link;
    });
    if (found) {
      found.remove();
    } else {
      // TODO: Clean this mess.
      let editor = this.editorRef;
      const zoneOverlay = new ZoneOverlay(link.range.startLineNumber, 15, link.link);
      editor.addOverlayWidget(zoneOverlay);
      editor.changeViewZones(changeAccessor => {
        const zoneId = changeAccessor.addZone(zoneOverlay);
        const removeZone = changeAccessor.removeZone;
        zoneOverlay.onRemove = () => {
          removeZone(zoneId);
          editor.removeOverlayWidget(zoneOverlay);
          this.setState(prevState => {
            return {openSymbols: prevState.openSymbols.filter(symbol => symbol.widgetId !== zoneOverlay.widgetId)}
          })
        };
        this.setState(prevState => {
          return {openSymbols: [zoneOverlay, ...prevState.openSymbols]}
        })
      });

      // TODO: Pass a close function.
      // TODO: Use left icon tabs.
      // <PagedDatasetTable href={`${Config.vtlUrl}/inspect/${link.link}`}/>
      // <VtlPlan href={`${Config.vtlUrl}/explain/${link.link}`}/>
      ReactDOM.render(
        <InspectorWidget href={link.link}/>, zoneOverlay.overlayDom
      )
    }

  }

  render() {
    return (
      <MonacoEditor
        width={this.props.width}
        height={this.props.height}

        language={LANGUAGE}
        theme="vs"

        defaultValue={this.props.defaultValue}
        options={this.props.options}
        onChange={this.props.onChange}

        editorDidMount={::this.editorDidMount}
        editorWillMount={::this.editorWillMount}
      />
    );
  }
}

Editor.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,

  errors: PropTypes.array,
  symbols: PropTypes.array,

  options: PropTypes.object,

  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Editor.defaultProps = {
  value: null,
  defaultValue: '',
  onChange: () => {
  },

  errors: [],
  symbols: [],

  options: {},

  width: '100%',
  height: '100%',
};


export default Editor;