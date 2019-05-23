const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
	module: {
		rules: [
			{
				test: /\.(s*)css$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader'],
				include: path.resolve(__dirname, '../'),
			},
		],
	},
	node: { fs: 'empty' },
	plugins: [
		new MonacoWebpackPlugin({
			languages: ['javascript'],
		}),
	],
};
