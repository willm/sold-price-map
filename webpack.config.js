const path = require('path');

module.exports = {
  entry: './src/client/script.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'client/static/script.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
