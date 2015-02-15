require.register('test/a/b/file', function(require, module, exports) {
  var a = require('a');
  var b = require('b');

  module.exports = a + b;
});
require.register('test/a/b', function(require, module, exports) {
  exports = {
    a: 4,
    b: 6
  };
});
require.register('test/a/file', function(require, module, exports) {
  var a = require('a');
  var b = require('b');

  module.exports = a + b;
});
require.register('test/a', function(require, module, exports) {
  exports = {
    a: 4,
    b: 6
  };
});
require.register('test/file', function(require, module, exports) {
  var a = require('a');
  var b = require('b');

  module.exports = a + b;
});
require.register('test', function(require, module, exports) {
  exports = {
    a: 4,
    b: 6
  };
});