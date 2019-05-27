import React from 'react';
import { shallow } from 'enzyme';
import { VtlEditor } from 'components';

const handleValue = value => console.log('value :', value);
const handleValid = bool => console.log('is valid :', bool);

describe('vtl-editor component', () => {
	it('renders without crashing', () => {
		shallow(<VtlEditor handleValue={handleValue} handleValid={handleValid} />);
	});
});
