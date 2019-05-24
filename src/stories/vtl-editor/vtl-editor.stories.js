import React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import { VtlEditor } from 'components';
import readme from './README.md';
import titleDecorator from 'utils/decorator/title-decorator';
import { select, boolean } from '@storybook/addon-knobs/react';

const themes = {
	'vs-dark': 'vs-dark',
	'vs-light': 'vs-light',
};
const handleValue = value => console.log('value :', value);
const handleValid = bool => console.log('is valid :', bool);

const stories = storiesOf('VtlEditor', module)
	.addDecorator(withReadme(readme))
	.addDecorator(Component => {
		const WrappedComponent = titleDecorator(Component);
		return <WrappedComponent title="<VtlEditor />" />;
	});

stories.addWithJSX('Default', () => (
	<VtlEditor handleValue={handleValue} handleValid={handleValid} />
));

stories.addWithJSX('Props', () => (
	<VtlEditor
		focus={boolean('Focus', false)}
		theme={select('Theme', themes, 'vs-dark')}
		handleValue={handleValue}
		handleValid={handleValid}
	/>
));
