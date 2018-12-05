var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/day1.js',
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  node: {
    __dirname: true,
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.bundle.js',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.ts', '.js', '.json'],
  },
  stats: {
    colors: true,
  },
  target: 'node',
};
