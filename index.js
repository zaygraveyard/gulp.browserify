/*eslint-env node */

var path = require('path');
var assign = require('object-assign');
var globby = require('globby');
var mergeStream = require('merge-stream');
var browserify = require('browserify');

function gulpBrowserify(glob, options, many) {
  return wrap(glob, function(entries) {
    return (many ? bundleMany : bundleOne)(entries, options);
  });
}

function wrap(glob, bundleEntries) {
  var stream = mergeStream();

  globby(glob).then(function(entries) {
    stream.add(bundleEntries(entries));
  }, function(err) {
    stream.emit('error', err);
  });

  return stream;
}

function getArgs(entries, options) {
  options = assign({
    basedir: process.cwd()
  }, options);

  var requires = options.requires || [];
  var transforms = options.transforms || [];

  delete options.requires;
  delete options.transforms;

  if (!Array.isArray(entries)) {
    entries = [entries];
  }
  entries = entries.map(function(entry) {
    return path.relative(options.basedir, entry);
  });

  return {
    entries: entries,
    requires: requires,
    transforms: transforms,
    options: options
  };
}

function bundle(entries, requires, transforms, options) {
  var b;

  b = browserify(options);

  transforms.forEach(function(transform) {
    if (!Array.isArray(transform)) {
      transform = [transform];
    }
    b.transform.apply(b, transform);
  });

  b.add(entries);
  b.require(requires);

  return b.bundle();
}

function bundleOne(entries, options) {
  var args = getArgs(entries, options);

  return bundle(args.entries, args.requires, args.transforms, args.options);
}

function bundleMany(entries, options) {
  var args = getArgs(entries, options);

  return args.entries.map(function(entry) {
    return bundle(entry, args.requires, args.transforms, args.options);
  });
}

module.exports = gulpBrowserify;
module.exports.wrap = wrap;
