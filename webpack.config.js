const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './index.js', // Entry point of your module
  output: {
    filename: 'index.min.js', // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
    library: 'jsUtilityLibrary', // UMD export variable name
    libraryTarget: 'umd', // UMD format
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()], // Minify the output
  },
};
