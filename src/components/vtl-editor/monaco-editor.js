import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';

class VtlEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
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
		const { theme } = this.props;
		const options = {
			selectOnLineNumbers: true,
		};
		return (
			<div className="vtl-editor">
				<MonacoEditor
					height="400"
					language="javascript"
					theme={theme}
					value={value}
					options={options}
					onChange={this.onChange}
					editorDidMount={this.editorDidMount}
				/>
			</div>
		);
	}
}

VtlEditor.propTypes = {
	focus: PropTypes.bool,
	theme: PropTypes.string,
};

VtlEditor.defaultProps = {
	focus: false,
	theme: 'vs-dark',
};

export default VtlEditor;
