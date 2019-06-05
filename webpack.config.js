const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: './src/components/index.js',
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: 'index.js',
		libraryTarget: 'commonjs',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /(node_modules|bower_components|lib)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env'],
					},
				},
			},
			{
				test: /\.(s*)css$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader'],
				include: path.resolve(__dirname, '../'),
			},
		],
	},
	externals: {
		react: 'commonjs react',
	},
	node: { module: 'empty', net: 'empty', fs: 'empty' },
	plugins: [
		new MonacoWebpackPlugin({
			languages: ['javascript'],
		}),
		new UglifyJSPlugin({
			uglifyOptions: {
				compress: {
					conditionals: true,
					unused: true,
					comparisons: true,
					sequences: true,
					dead_code: true,
					evaluate: true,
					if_return: true,
					join_vars: true,
				},
			},
		}),
	],
};
