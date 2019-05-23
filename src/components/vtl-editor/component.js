import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';

class VtlEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
		};
		this.onChange = value => this.setState({ value });
		this.editorDidMount = editor => {
			const { focus } = props;
			focus && editor.focus();
		};
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
