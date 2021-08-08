const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src',
  output: {
    filename: 'index.js',
    path: path.resolve(process.cwd(), 'dist')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$|\.tsx?$/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  }
}
