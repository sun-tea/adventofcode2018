var path = require('path');
// var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './src/KataBankOCR.js',
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
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.bundle.js',
  },
  node: {
    __dirname: true,
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  stats: {
    colors: true,
  },
  target: 'node',
};
