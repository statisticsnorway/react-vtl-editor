import antlr4 from 'antlr4';

function ErrorListener(errors) {
	antlr4.error.ErrorListener.call(this);
	this.errors = errors;
	return this;
}

ErrorListener.prototype = Object.create(antlr4.error.ErrorListener.prototype);
ErrorListener.prototype.constructor = ErrorListener;
ErrorListener.prototype.syntaxError = function(rec, sym, line, col, msg, e) {
	const { start, stop } = sym;
	const error = {
		startLineNumber: line,
		endLineNumber: line,
		startColumn: col,
		endColumn: start >= 0 && stop >= 0 ? col + stop - start + 1 : col,
		message: msg,
		severity: 8,
	};
	this.errors.push(error);
};

export default ErrorListener;
