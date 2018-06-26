'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ScriptExtPlugin = require('script-ext-html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { AngularCompilerPlugin } = require('@ngtools/webpack')

const rootDir = path.join(__dirname)

module.exports = {
	mode: 'production',
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
/*			{
        test: /\.css$/,
        use: [
           MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      */
			{ test: /\.css$/, use: 'raw-loader' },
			{ test: /\.html$/, use: 'raw-loader' }
		]
	},
	plugins	: [
		/* Bundle all you styling into one style.css file */
		//new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),
/*
	    new MiniCssExtractPlugin({
	      // Options similar to the same options in webpackOptions.output
	      // both options are optional
	      filename: "[name].css",
	      chunkFilename: "[id].css"
	    }),
	    */

		new CopyWebpackPlugin([
			//{ test: /(.+\/)?(.+)\.css$/, from: path.join(rootDir, 'src'), to: './assets/styles/[2].[ext]' }
			{ from: './src/**/*.css', to: 'assets/styles' }
		]),

		new CopyWebpackPlugin([
			{ from: path.join(rootDir, 'src', 'assets'), to: 'assets' }
		]),

		new HtmlWebpackPlugin({
			template: path.join(rootDir, 'src', 'index.html'),
			output: path.join(rootDir, 'dist'),
			inject: 'head'
		}),

		new ScriptExtPlugin({
			defaultAttribute: 'defer'
		}),

		new AngularCompilerPlugin({
			tsConfigPath: path.join(rootDir, 'tsconfig.json'),
			entryModule: path.join(rootDir, 'src', 'app', 'app.module#AppModule'),
			sourceMap: true,
			skipCodeGeneration: false
		})
	]
}
