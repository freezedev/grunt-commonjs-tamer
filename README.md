grunt-commonjs-tamer
====================

[![Build Status](https://travis-ci.org/freezedev/grunt-commonjs-tamer.png?branch=master)](https://travis-ci.org/freezedev/grunt-commonjs-tamer)
[![Dependency Status](https://david-dm.org/freezedev/grunt-commonjs-tamer.png)](https://david-dm.org/freezedev/grunt-commonjs-tamer)
[![devDependency Status](https://david-dm.org/freezedev/grunt-commonjs-tamer/dev-status.png)](https://david-dm.org/freezedev/grunt-commonjs-tamer#info=devDependencies)


This module helps you manage your CommonJS modules to be used in the browser.  
In a way it's similar to browserify, but `grunt-commonjs-tamer` allows for more fine-grained control.

Are you rather working with AMD modules? Check out [grunt-amd-tamer](http://github.com/freezedev/grunt-amd-tamer)

## Getting Started
This plugin requires Grunt `^0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-commonjs-tamer --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-commonjs-tamer');
```

## The "commonjs_tamer" task

### Overview
In your project's Gruntfile, add a section named `amd_tamer` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  commonjs_tamer: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  }
})
```

You can then call the task using `grunt commonjs_tamer`.

### Usage Examples

#### Default Options
In this example, the default options are used to do get a bunch javascript files and set `src/` as a base for all modules.

```js
grunt.initConfig({
  commonjs_tamer: {
    options: {
      base: 'src/'
    },
    files: {
      'dest/file.js': ['src/**/*.js'],
    }
  }
})
```

### Options

#### options.separator
Type: `String`
Default value: `grunt.util.linefeed`

The separator between files. Usually, you don't need to change this

#### options.register
Type: `String`
Default value: `require.register`

The function where modules will be registered to.
```js
require.register(function() {
  // Module content here
});
```

#### options.normalizeIndexFile
Type: `Boolean`
Default value: `true`

Normalizes the index file, which is defauöt CommonJS behavior with `index.js` files. A file with `index.js` as its filename will resolve to its parent folder, e.g. a module named `folder/index` will become `folder`.

#### options.beautify
Type: `Boolean` or `Object`
Default value: true

Beautifies the resulting file(s) using `js-beautify.` If it's an object, it will be directly passed into the beautifier,
if it's a boolean these values will be used:
```js
{
  indent_size: 2
}
```

#### options.base
Type: `String`
Default value: `null`

Cuts off the string provided from the module name, e.g. if `src/` is provided, `src/mymodule` will be `mymodule`

#### options.doubleQuotes
Type: `Boolean`
Default value: `false`

If set to true, generated module names and shims are wrapped in double quotes instead of single quotes.

#### options.namespace
Type: `String`
Default value: `null`

Prepends a namespace to each module name, e.g. if `test` is set as the namespace, `mymodule` becomes `test/mymodule`.

#### options.processName
Type: `Function`

Allows to define a function to process module names.

#### options.process
Type: `Function`

Allows to process the file after transformation

#### options.sourceMap
Type: `Boolean`
Default value: `true`

Generates a source map for the generated files. The source mapping URL does not get appended automatically though,
you need handle that manually using `options.footer`.

#### options.blacklist
Type: `Array`

Module names inside the blacklist will not be transformed, only concatenated 
to the output file. This is especially useful if your goal is to have only a 
single JavaScript file in the end.

#### options.banner
Type: `String` or `Function`

Prepend something to the resulting file, like a copyright notice.

#### options.footer
Type: `String` or `Function`

Append something to the resulting file, like a source map reference.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.0.1  Initial version  

## License
Public domain (Unlicense), but can also be licensed under the terms of the MIT 
license. Choose the one that fits your purpose best.