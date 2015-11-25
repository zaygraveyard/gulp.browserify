/*eslint-env node */

var path = require('path');
var assign = require('object-assign');
var globby = require('globby');
var through = require('through2');

var browserify = require('browserify');

module.exports = function(glob, options) {
  options = assign({
    basedir: process.cwd()
  }, options);

  var requires = options.requires || [];
  delete options.requires;

  var transforms = options.transforms || [];
  delete options.transforms;

  // gulp expects tasks to return a stream, so we create one here.
  var bundledStream = through();

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby(glob).then(function(entries) {
    var b;

    entries = entries.map(function(entry) {
      return path.relative(options.basedir, entry);
    });

    // create the Browserify instance.
    b = browserify(options);

    transforms.forEach(function(transform) {
      if (!Array.isArray(transform)) {
        transform = [transform];
      }
      b.transform.apply(b, transform);
    });

    b.add(entries);
    b.require(requires);

    // pipe the Browserify stream into the stream we created earlier
    // this starts our gulp pipeline.
    b.bundle().pipe(bundledStream);
  }, function(err) {
    bundledStream.emit('error', err);
  });

  return bundledStream;
};
