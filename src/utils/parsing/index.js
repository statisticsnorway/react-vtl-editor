import antlr4 from 'antlr4';
import * as VTL2 from './vtl-2.0';
import * as VTL2_ISTAT from './vtl-2.0-istat';
import * as VTL11_HADRIEN from './vtl-1.1-hadrien-kohl';
import SimpleErrorListener from './SimpleErrorListener';

export const getErrors = grammar => text => {
	const errors = [];
	const chars = new antlr4.InputStream(text);
	const { Lexer, Parser } = getTools(grammar);
	const lexer = new Lexer(chars);
	const tokens = new antlr4.CommonTokenStream(lexer);
	const parser = new Parser(tokens);
	parser.buildParseTrees = true;
	const listener = new SimpleErrorListener(errors);
	parser.removeErrorListeners();
	parser.addErrorListener(listener);
	parser.start();
	return errors;
};

const getTools = grammar => {
	switch (grammar) {
		case 'vtl-2.0-istat':
			return VTL2_ISTAT;
		case 'vtl-1.1-hadrien-kohl':
			return VTL11_HADRIEN;
		case 'vtl-2.0':
		default:
			return VTL2;
	}
};
