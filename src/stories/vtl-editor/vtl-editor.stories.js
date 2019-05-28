import React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import { VtlEditor } from 'components';
import readme from './README.md';
import titleDecorator from 'utils/decorator/title-decorator';
import { select, boolean } from '@storybook/addon-knobs/react';

const grammars = {
	'vtl-2.0': 'vtl-2.0',
	'vtl-2.0-istat': 'vtl-2.0-istat',
	'vtl-1.1-hadrien-kohl': 'vtl-1.1-hadrien-kohl',
};
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
		grammar={select('Grammar', grammars, 'vtl-2.0')}
		focus={boolean('Focus', false)}
		theme={select('Theme', themes, 'vs-dark')}
		handleValue={handleValue}
		handleValid={handleValid}
		showLineNumbers={boolean('Show line numbers', false)}
		showMinimap={boolean('Show minimap', false)}
	/>
));
