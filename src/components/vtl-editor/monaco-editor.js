import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';

const disableLineNumbers = {
	lineNumbers: 'off',
	glyphMargin: false,
	folding: false,
	// Undocumented see https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
	lineDecorationsWidth: 0,
	lineNumbersMinChars: 0,
};

class VtlEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
		};
		this.onChange = value => {
			const { handleErrors } = props;
			handleErrors(value);
			this.setState({ value });
		};
		this.editorDidMount = (editor, monaco) => {
			this.monacoRef = monaco;
			this.editorRef = editor;
			const { focus } = props;
			focus && editor.focus();
		};
		this.updateMarkers = markers => {
			let monaco = this.monacoRef;
			let editor = this.editorRef;
			monaco.editor.setModelMarkers(editor.getModel(), 'test', markers);
		};
	}

	componentDidMount() {
		this.updateMarkers(this.props.errors);
	}

	componentDidUpdate() {
		this.updateMarkers(this.props.errors);
	}

	render() {
		const { value } = this.state;
		const { theme, showMinimap, showLineNumbers } = this.props;
		const options = {
			selectOnLineNumbers: true,
			minimap: {
				enabled: showMinimap,
			},
		};
		const customOptions = showLineNumbers
			? options
			: { ...options, ...disableLineNumbers };
		return (
			<div className="vtl-editor">
				<MonacoEditor
					width="100%"
					height="400"
					language="javascript"
					theme={theme}
					value={value}
					options={customOptions}
					onChange={this.onChange}
					editorDidMount={this.editorDidMount}
				/>
			</div>
		);
	}
}

VtlEditor.propTypes = {
	value: PropTypes.string,
	focus: PropTypes.bool,
	theme: PropTypes.string,
	showLineNumbers: PropTypes.bool,
	showMinimap: PropTypes.bool,
};

VtlEditor.defaultProps = {
	value: '',
	focus: false,
	theme: 'vs-dark',
	showLineNumbers: false,
	showMinimap: false,
};

export default VtlEditor;
