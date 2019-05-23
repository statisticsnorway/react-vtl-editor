import React, {Component} from 'react';
import Axios from "axios";

import './VtlEditor.css'
import * as debounce from "debounce";
import Editor from "./Editor";
import Config from "../../Config";
import PropTypes from "prop-types";

const axios = Axios.create({withCredentials: true});
const VTL_TOOLS_URL = `${Config.vtlUrl}/check`;

function normalizeErrors(response) {
  return response.data.map(error => {
    return {
      startLineNumber: error.startLine,
      endLineNumber: error.stopLine,
      startColumn: error.startColumn + 1,
      endColumn: (error.endColumn !== error.startColumn ? error.stopColumn : error.startColumn + 1) + 1,
      message: error.message,
      severity: "Error"
    }
  });
}

function normalizeSymbols(response) {
  return response.data.map(symbol => {
    return {
      startLineNumber: symbol.startLine,
      endLineNumber: symbol.stopLine,
      startColumn: symbol.startColumn + 1,
      endColumn: symbol.stopColumn + 1,
      name: symbol.name,
      id: symbol.id
    }
  });
}

/**
 * Glue the underlying editor with vtl-tools.
 */
class VtlEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errors: [],
      symbols: [],
      checking: false
    };
    // TODO: Should immediately cancel previous debounce.
    this.onChange = debounce(value => {
      this.checkExpression(value);
      this.inspectExpression(value);
    }, 200, true);
  }

  /**
   * Check the expression for syntax error.
   * @param expression a VTL expression
   */
  checkExpression(expression) {
    this.setState({checking: true, value: expression});
    axios.post(VTL_TOOLS_URL, expression, {
      headers: {
        "Content-Type": "text/plain"
      }
    }).then(response => {
      let errors = normalizeErrors(response);
      this.setState({
        errors: errors
      });
    }).catch(error => {
      this.setState({error})
    }).finally(() => {
      this.setState({checking: false})
    })
  }

  /**
   * Inspect the expression
   * @param expression a VTL expression
   */
  inspectExpression(expression) {
    this.setState({inspecting: true, value: expression});
    axios.post(`${Config.vtlUrl}/inspect`, expression, {
      headers: {
        "Content-Type": "text/plain"
      }
    }).then(response => {
      let symbols = normalizeSymbols(response);
      this.setState(prevState => ({
        symbols: symbols
      }));
    }).catch(error => {
      this.setState({symbols: []})
    })
  }

  render() {
    return (
      <div>
        <Editor
          defaultValue={this.props.value}
          height={500}
          onChange={this.onChange}
          errors={this.state.errors}
          symbols={this.state.symbols}
        />
      </div>
    );
  }
}

VtlEditor.propTypes = {
  value: PropTypes.string
};

export default VtlEditor;