require.register 'a', (require, module, exports) ->
  module.exports = 5
require.register 'b', (require, module, exports) ->
  a = require 'a'

  module.exports = a * 4
require.register 'c', (require, module, exports) ->
  module.exports = 10