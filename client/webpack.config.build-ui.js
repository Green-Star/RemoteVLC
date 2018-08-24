'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ScriptExtPlugin = require('script-ext-html-webpack-plugin')
const { AngularCompilerPlugin } = require('@ngtools/webpack')

const exec = require('child_process').exec
const util = require('util');


const rootDir = path.join(__dirname)

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: [
		'webpack-hot-middleware/client?reload=true',
		/* main: path.join(rootDir, 'src', 'main.ts') */
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
/*
    {
      apply: (compiler) => {
        compiler.hooks.watchRun.tap('AfterEmitPlugin', (compilation) => {
        	console.log('HOOK TRIGGERED')
        	//console.log(JSON.stringify(compilation))
          exec('touch ' + path.join(rootDir, 'src', 'index.html'), (err, stdout, stderr) => {
            if (stdout) process.stdout.write(stdout);
            if (stderr) process.stderr.write(stderr);
          });
        });
      }
    },
*/

/*
    {
      apply: (compiler) => {
        compiler.hooks.watchRun.tap('WatchRunPlugin', (watching, done) => {
        	console.log('HOOK TRIGGERED')
//        	console.log(util.inspect(watching))
        	console.log('****************')
        	console.log(util.inspect(watching.inputFileSystem._webpackCompilerHost._changedFiles))

        	let property = path.join(rootDir, 'src', 'index.html')
//        	watching.inputFileSystem._webpackCompilerHost._changedFiles[property] = true

        	/* Touch index.html si on a des htmls sans index.html ? *//*
        	//console.log(watching.inputFileSystem._webpackCompilerHost._changedFiles.keys())
        	console.log("{")
			console.log(Object.keys(watching.inputFileSystem._webpackCompilerHost._changedFiles))
			console.log("}")

        	let files = Object.keys(watching.inputFileSystem._webpackCompilerHost._changedFiles)
        	let found = files.find(file => file === property)

        	if (found === undefined) {
        		console.warn('index.html NOT MODIFIED')
        	} else {
        		console.warn('index.html MODIFIED !!!')
        	}


        	console.log('******* 2 ******')
        	console.log(util.inspect(watching.inputFileSystem._webpackCompilerHost._changedFiles))
        	
//        	exec('touch ' + path.join(rootDir, 'src', 'index.html'))
//        	console.log(util.inspect(watching.inputFileSystem.VirtualFileSystemDecorator._webpackCompilerHost.WebpackCompilerHost._changedFiles))
//        	const changedTime = watching.compiler.watchFileSystem.watcher.mtimes

    //    	console.log(JSON.stringify(changedTime))
    //      exec('touch ' + path.join(rootDir, 'src', 'index.html'), (err, stdout, stderr) => {
      //      if (stdout) process.stdout.write(stdout);
      //      if (stderr) process.stderr.write(stderr);
      //    });
        });
      }
    },
    */

    {
      apply: (compiler) => {
        compiler.hooks.watchRun.tap('ForceReloadPlugin', (watching, done) => {
        	forceReload(watching, path.join(rootDir, 'src', 'index.html'), '.html') 
        });
      }
    },


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
/*
		new CleanWebpackPlugin([
			path.join(rootDir, 'dist')
		]),
*/
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
