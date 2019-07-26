import React, { useState } from 'react';
import { VtlEditor } from 'react-vtl-editor';
import './react-vtl-editor.scss';

const ReactVtlEditor = () => {
	const [value, setValue] = useState('');
	const [valid, setValid] = useState(true);
	return (
		<>
			<h1 className="centered">react-vtl-editor</h1>
			<div className="react-vtl-editor">
				<VtlEditor handleValue={setValue} handleValid={setValid} />
			</div>
			<h2 className={`centered ${!valid && 'invalid'}`}>
				{value && `Expression " ${value} " is ${valid ? 'valid' : 'invalid'}`}
			</h2>
		</>
	);
};

export default ReactVtlEditor;
