import React from 'react';
import { shallow } from 'enzyme';
import { VtlEditor } from 'components';

describe('vtl-editor component', () => {
	it('renders without crashing', () => {
		shallow(<VtlEditor />);
	});
});
