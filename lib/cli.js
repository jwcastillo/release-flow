'use strict';

require('babel-polyfill');

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _path = require('path');

var _Release = require('./Release');

var _Release2 = _interopRequireDefault(_Release);

var _bumpPackageJson = require('./plugins/bump-package-json');

var _bumpPackageJson2 = _interopRequireDefault(_bumpPackageJson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _bumpPackageJson2.default)(_Release2.default);

var program = _yargs2.default.options({
  config: {
    alias: ['c'],
    describe: 'configuration file path (JSON or Javascript)',
    type: 'string',
    normalize: true,
    default: '.releaseflowrc'
  }
}).locale('en').usage('Usage: $0 <command> [options]').command('start', 'Starts a release').demand(1).strict().help().version();

var argv = program.argv;

if (argv._.length > 1) {
  program.showHelp();
  process.exit(1);
}

var options = {};
var configLoadError = null;

if (argv.config) {
  try {
    options = require((0, _path.resolve)(process.cwd(), argv.config));
  } catch (e) {
    configLoadError = e;
  }
}

var release = new _Release2.default(options);

if (configLoadError) {
  release.logger.warn(configLoadError.message);
  release.logger.warn('Using default configuration');
}

var command = argv._[0];

release[command](release).catch(function (err) {
  release.logger.error(err.message);
  process.exit(1);
});