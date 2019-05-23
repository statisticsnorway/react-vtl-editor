import antlr4 from 'antlr4';

function ErrorListener(errors) {
  antlr4.error.ErrorListener.call(this);
  this.errors = errors;
  return this;
}

ErrorListener.prototype = Object.create(antlr4.error.ErrorListener.prototype);
ErrorListener.prototype.constructor = ErrorListener;
ErrorListener.prototype.syntaxError = function(rec, sym, line, col, msg, e) {
  this.errors.push(msg);
};

export default ErrorListener;
