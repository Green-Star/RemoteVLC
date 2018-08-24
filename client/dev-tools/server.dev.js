"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var path = require("path");
var methodOverride = require("method-override");
var logger_1 = require(path.join(__dirname, '..', '..', 'dist', 'server', 'logger'));
var player_1 = require(path.join(__dirname, '..', '..', 'dist', 'server', 'player'));
var router_1 = require(path.join(__dirname, '..', '..', 'dist', 'server', 'router'));
if (!process.argv[2]) {
    logger_1.logger.error('Missing media filename to play');
    logger_1.logger.info('Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' <media filename>');
    process.exit(1);
}
logger_1.logger.info('Starting Remote control for ' + process.argv[2]);
/*** Start player control ***/
logger_1.logger.info('Spawning player ...');
// Use a mock player when building WebUI
var player = player_1.PlayerFactory.getPlayer('mock-player', process.argv[2]);
// let player = PlayerFactory.getPlayer('vlc', process.argv[2])
player.start();
/*** Start WebUI control ***/
logger_1.logger.info('Spawning web UI');
var app = express();
var router = new router_1.Router(player);


//const exec = require('child_process').exec
(function () {
    // Step 1: Create & configure a webpack compiler
    var webpack = require('webpack');
    var webpackConfig = require('../../client/webpack.config');

//    webPackConfig.module.hot
    console.log(webpackConfig.module)

    var compiler = webpack(webpackConfig);
/*
    compiler.plugin('watchRun', (compilation, callback) => {
            logger_1.logger.info('Have I reached here?');
            let s = 'touch "' + path.join(__dirname, 'src', 'index.html') +'"'
            exec(s)
//            callback()
})
*/

    // Step 2: Attach the dev middleware to the compiler & the server
    app.use(require("webpack-dev-middleware")(compiler, {
        logLevel: 'warn', publicPath: webpackConfig.output.publicPath
    }));
    // Step 3: Attach the hot middleware to the compiler & the server
    app.use(require("webpack-hot-middleware")(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
    console.log(JSON.stringify(compiler.hooks))
    logger_1.logger.warn(JSON.stringify(compiler.hooks.afterEmit))
})();
/* Use client/dist folder to serve static files */
app.use(express.static(path.join(path.dirname(path.dirname(__dirname)), 'client', 'dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
/* Log requests */
app.use(morgan('dev', { stream: logger_1.logger.stream }));
app.use('/', router.getInternalRouter());
var server = http.createServer(app);
server.listen(8080);
logger_1.logger.info('Server started');
logger_1.logger.info('Server listening on ' + server.address());
//# sourceMappingURL=server.js.map