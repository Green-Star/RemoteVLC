'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ScriptExtPlugin = require('script-ext-html-webpack-plugin')
const { AngularCompilerPlugin } = require('@ngtools/webpack')

const rootDir = path.join(path.dirname(__dirname))

module.exports = {
	entry: {
		main: path.join(rootDir, 'src', 'main.ts')
	},
	output: {
		path: path.join(rootDir, 'dist'),
		filename: '[name].bundle.js',
		publicPath: '/'
	},
	resolve: {
		extensions: [ '.ts', '.js' ]
	},
	module: {
		rules: [
			{ test: /\.ts$/, use: '@ngtools/webpack', exclude: /node_modules/ },
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
    				'css-to-string-loader',
    				{ loader: 'css-loader', options: { sourceMap: true } }
    			]
			},
			{ test: /\.html$/, use: 'html-loader' }

		]
	},
	plugins	: [

		new CopyWebpackPlugin([
			{ from: path.join(rootDir, 'src', 'assets'), to: 'assets' },
			{ from: './src/**/*.css', to: 'assets/styles', flatten: true }
		]),

		new HtmlWebpackPlugin({
			template: path.join(rootDir, 'src', 'index.html'),
			output: path.join(rootDir, 'dist'),
			inject: 'body'
		}),

		new ScriptExtPlugin({
			defaultAttribute: 'defer'
		}),

		new AngularCompilerPlugin({
			tsConfigPath: path.join(rootDir, 'tsconfig.json'),
			entryModule: path.join(rootDir, 'src', 'app', 'app.module#AppModule'),
			sourceMap: true,
			skipCodeGeneration: false
		}),

		new CleanWebpackPlugin(),

	]
}
