'use strict'

const path = require('path')
const webpack = require('webpack')
const exec = require('child_process').exec
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ScriptExtPlugin = require('script-ext-html-webpack-plugin')
const { AngularCompilerPlugin } = require('@ngtools/webpack')

const rootDir = path.join(path.dirname(__dirname))
const HTMLIndexFile = path.join(rootDir, 'src', 'index.html')

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: [
		'webpack-hot-middleware/client?reload=true',
		path.join(rootDir, 'src', 'main.ts'),
	],
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
			{ test: /\.css$/, use: 'raw-loader' },
			{ test: /\.html$/, use: 'raw-loader' }
		]
	},
	plugins	: [

	    new webpack.HotModuleReplacementPlugin(),

	    new webpack.NoEmitOnErrorsPlugin(),

	    {
	      apply: (compiler) => {
	        compiler.hooks.watchRun.tap('ForceReloadPlugin', (watching, done) => {
	        	forceReload(watching, HTMLIndexFile, '.html') 
	        });
	      }
	    },


		new CopyWebpackPlugin([
			{ from: path.join(rootDir, 'src', 'assets'), to: 'assets' },
			{ from: './src/**/*.css', to: 'assets/styles', flatten: true }
		]),

		new HtmlWebpackPlugin({
			template: HTMLIndexFile,
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

	]
}

function forceReload(webpackWatching, resourceToReload, resourceType) {
	let reload = true
	let changedFiles = Object.keys(webpackWatching.inputFileSystem._webpackCompilerHost._changedFiles)
	
	let changedResource = changedFiles.find(file => file === resourceToReload)

	/* If the resource to reload has already been modified, there's no need to reload it */
	if (changedResource !== undefined) {
		reload = false
	} else {
		/* The resource has not been modified, let's see if we need to reload it ... */

		/* If it depends of a particular type file, we need to check if a file of this type has been modified */ 
		if (resourceType) {
			let changedResourceType = changedFiles.find(pathToResource => path.parse(pathToResource).ext === resourceType)

			/* No resourceType files has been modified, no need to force reload the resource */
			if (changedResourceType === undefined) {
				reload = false
			}
		}
		/* No particular resourceType file have been provided => always reload the resource */
	}

	if (reload === true) {
		console.log(`Force reloading ${resourceToReload}`)
		exec(`touch ${resourceToReload}`)
	}
}
