require.register('file', function(require, module, exports) {
  var a = require('a');
  var b = require('b');

  module.exports = a + b;
});
require.register('folder/index', function(require, module, exports) {
  exports = {
    a: 4,
    b: 6
  };
});