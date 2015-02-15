require.register('folder', function(require, module, exports) {
  var submodule = require('folder/submodule');

  module.exports = 10;
});
require.register('folder/subsubmodule', function(require, module, exports) {
  exports.c = 3;
  exports.d = 5;
});
require.register('module', function(require, module, exports) {
  var a = require('a');
  var b = require('b');
  var c = require('c');

  module.exports = 5;
});