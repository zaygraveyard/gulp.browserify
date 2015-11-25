# gulp.browserify

## Install

With [npm](https://npmjs.org) do:

```sh
npm i -D gulp.browserify
```

## Usage

```js
var browserify = require('gulp.browserify');

gulp.task('scripts', function() {
  return browserify('src/entry.js')
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dest'));
});
```

## API

`browserify(glob, options)`

### glob

### options

## License

MIT
