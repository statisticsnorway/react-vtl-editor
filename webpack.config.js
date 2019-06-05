const path = require('path');
const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/components/index.js',
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: 'index.js',
		libraryTarget: 'umd',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /(node_modules|lib)/,
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
		react: 'react',
	},
	node: { module: 'empty', net: 'empty', fs: 'empty' },
	plugins: [
		new MonacoWebpackPlugin({
			languages: ['javascript'],
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"',
		}),
	],
	optimization: {
		minimize: true,
		minimizer: [new UglifyJsPlugin()],
	},
};
