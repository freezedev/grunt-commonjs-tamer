/*
 * grunt-commonjs-tamer
 * https://github.com/freezedev/grunt-commonjs-tamer
 *
 */

'use strict';

var path = require('path');
var beautify = require('js-beautify').js_beautify;
var coffeeFormatter = require('coffee-formatter');
var SourceMapConcat = require('sourcemap-concat').SourceMapConcatenator;

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
      processName: function(name /*, basename */) {
        return name;
      },
      process: function(content /*, moduleName */) {
        return content;
      },
      blacklist: [],
      banner: '',
      footer: ''
    });

    var quotes = (options.doubleQuotes) ? '"' : '\'';
    
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var sourceMapConcat = new SourceMapConcat({file: f.dest});
      
      var src = '';

      if (options.banner) {
        if (typeof options.banner === 'function') {
          src += options.banner(f.dest);
        } else {
          src += options.banner;
        }
      }
      
      // Concat specified files.
      src = f.src.filter(function(filepath) {
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
        
        var isCoffeeScript = extension === '.coffee';
        
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
        
        if (options.blacklist.indexOf(moduleName) >= 0) {
          return;
        }
        
        if (isCoffeeScript) {
          source = options.register + ' ' + quotes + moduleName + quotes + ', (require, module, exports) ->' +
          options.separator + (function(s) {
            return s.split(options.separator).map(function(l) {
              return '\t' + l;
            }).join(options.separator);
          })(source) + options.separator + options.separator;
        } else {
          source = options.register + '(' + quotes + moduleName + quotes + ', function(require, module, exports) {' +
          options.separator + source + options.separator + '});';
        }
        
        if (options.beautify) {
          if (!isCoffeeScript) {
            var beautifyOptions = {};

            if (typeof options.beautify === 'object') {
              beautifyOptions = options.beautify;
            } else {
              beautifyOptions = {
                indent_size: 2
              };
            }

            source = beautify(source, beautifyOptions);
          } else {
            source = coffeeFormatter.formatTwoSpaceOperator(source);
          }
        }
        
        source = options.process(source, moduleName);

        if (options.sourceMap) {
          var prevSourceMap;
          var sourceMapFile = filepath + '.map';
          var file;

          var sourceMapComment = '//# sourceMappingURL=';
          var hasSourceMap = source.indexOf(sourceMapComment) >= 0;

          if (hasSourceMap) {
            var smMatch = source.match(/\/\# sourceMappingURL=(.*)/);
            file = smMatch[1];

            var basename = path.basename(filepath);
            var sourceMapPath = filepath.split(basename)[0];

            sourceMapFile = [sourceMapPath, file].join(path.sep);
          }

          if (grunt.file.exists(sourceMapFile)) {
            prevSourceMap = grunt.file.readJSON(sourceMapFile);
          }

          if (hasSourceMap) {
            source = source.split(sourceMapComment + file)[0];
          }

          var fileSource = source;

          if (index !== filtered.length - 1 && !prevSourceMap) {
            fileSource += grunt.util.normalizelf(options.separator);
          }

          sourceMapConcat.add(filepath, source, prevSourceMap);
        }

        return source;
      }).join(grunt.util.normalizelf(options.separator));

      if (options.footer) {
        if (typeof options.footer === 'function') {
          src += options.footer(f.dest);
        } else {
          src += options.footer;
        }
      }
      
      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
