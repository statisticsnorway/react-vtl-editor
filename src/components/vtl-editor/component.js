import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getErrors } from '../../utils/parsing';
import MonacoEditor from './monaco-editor';

const Editor = props => {
	const [errors, setErrors] = useState([]);
	const handleErrors = value => {
		const { grammar, handleValue, handleValid } = props;
		const newErrors = getErrors(grammar)(value);
		handleValue(value);
		handleValid(newErrors.length === 0);
		setErrors(newErrors);
	};
	return (
		<MonacoEditor errors={errors} handleErrors={handleErrors} {...props} />
	);
};

Editor.propTypes = {
	value: PropTypes.string,
	grammar: PropTypes.string,
	handleValid: PropTypes.func.isRequired,
	handleValue: PropTypes.func.isRequired,
};

Editor.defaultValue = {
	value: '',
	grammar: 'vtl-2.0',
};

export default Editor;
