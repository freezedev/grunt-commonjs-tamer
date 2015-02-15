/*
 * grunt-commonjs-tamer
 * https://github.com/freezedev/grunt-commonjs-tamer
 *
 */

'use strict';

var path = require('path');
var beautify = require('js-beautify').js_beautify;

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('commonjs_tamer', 'Tame your CommonJS modules', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      register: 'require.register',
      separator: grunt.util.linefeed,
      beautify: true,
      normalizeIndexFile: true,
      base: null,
      namespace: null,
      sourcemap: true,
      processName: function(name) {
        return name;
      },
      process: function() {

      },
      blacklist: []
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        var source = grunt.file.read(filepath);
        var extension = path.extname(filepath);
        
        var moduleName = filepath.split(extension)[0];
        if (options.base && moduleName.indexOf(options.base) === 0) {
          moduleName = moduleName.split(options.base)[1];
        }
        
        if (options.normalizeIndexFile && moduleName.indexOf('/index') > 0) {
          moduleName = moduleName.replace('/index', '');
        }
        
        if (options.namespace) {
          // If index.js is in the root folder and a namespace has been defined
          // use the namespace as the module name
          if (options.normalizeIndexFile && moduleName === 'index') {
            moduleName = options.namespace;
          } else {
            moduleName = options.namespace + '/' + moduleName;            
          }
        }
        
        moduleName = options.processName(moduleName, path.basename(moduleName));
        

        source = options.register + '(\'' + moduleName + '\', function(require, module, exports) {' +
        options.separator + source + options.separator + '});';
        
        if (options.beautify) {
          source = beautify(source, {
            indent_size: 2
          });
        }

        return source;
      }).join(grunt.util.normalizelf(options.separator));

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
