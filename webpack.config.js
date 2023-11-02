// const path = require('path');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// module.exports = {
//   entry: './index.js', // Entry point of your module
//   output: {
//     filename: 'index.min.js', // Output file name
//     path: path.resolve(__dirname, 'dist'), // Output directory
//     library: 'jsUtilityLibrary', // UMD export variable name
//     libraryTarget: 'umd', // UMD format
//   },
//   optimization: {
//     minimizer: [new UglifyJsPlugin()], // Minify the output
//   },
// };

// const path = require('path');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// module.exports = [
//   // UMD build
//   {
//     entry: './index.js', // Entry point of your module
//     output: {
//       filename: 'index.min.js', // Output file name
//       path: path.resolve(__dirname, 'dist'), // Output directory
//       library: 'jsUtilityLibrary', // UMD export variable name
//       libraryTarget: 'umd', // UMD format
//     },
//     optimization: {
//       minimizer: [new UglifyJsPlugin()], // Minify the output
//     },
//   },
//   // ESM build
//   {
//     entry: './index.js', // Entry point of your module
//     output: {
//       filename: 'index.mjs', // Output file name for ESM
//       path: path.resolve(__dirname, 'dist'), // Output directory
//       libraryTarget: 'module', // ESM format
//     },
//     optimization: {
//       minimizer: [new UglifyJsPlugin()], // Minify the output
//     },
//   },
// ];

const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './index.js', // Entry point of your module
  output: {
    filename: 'index.mjs', // Output file name for ESM
    path: path.resolve(__dirname, 'dist'), // Output directory
    libraryTarget: 'module', // ESM format
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()], // Minify the output
  },
};
