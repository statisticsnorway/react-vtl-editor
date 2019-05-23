import React, { useState } from 'react';
import antlr4 from 'antlr4';
import { VtlLexer, VtlParser, SimpleErrorListener } from '../../utils/parsing';
import MonacoEditor from './monaco-editor';

const parse = text => {
	const errors = [];
	const chars = new antlr4.InputStream(text);
	const lexer = new VtlLexer(chars);
	const tokens = new antlr4.CommonTokenStream(lexer);
	const parser = new VtlParser(tokens);
	parser.buildParseTrees = true;
	const listener = new SimpleErrorListener(errors);
	parser.removeErrorListeners();
	parser.addErrorListener(listener);
	parser.start();
	return errors;
};

const Editor = props => {
	const [errors, setErrors] = useState([]);
	return (
		<MonacoEditor
			errors={errors}
			handleErrors={text => setErrors(parse(text))}
			{...props}
		/>
	);
};

export default Editor;
