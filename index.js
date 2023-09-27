(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD module
    define(['./src/functions'], factory);
  } else if (typeof exports === 'object' && typeof module !== 'undefined') {
    // CommonJS module (Node.js)
    module.exports = factory(require('./src/functions'));
  } else {
    // Global variable (browser)
    root.myFunctions = factory(root.myFunctions || {});
  }
})(typeof self !== 'undefined' ? self : this, function (myFunctions) {
  // The UMD wrapper ensures that 'myFunctions' is available in the current environment.
  return myFunctions;
});
