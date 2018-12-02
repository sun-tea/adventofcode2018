var path = require('path');
// var webpack = require('webpack');

module.exports = {
  entry: './src/KataBankOCR.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
  stats: {
    colors: true,
  },
  devtool: 'source-map',
  target: 'node',
  node: {
    __dirname: true,
  }
};
