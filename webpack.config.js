const path = require('path');
// https://medium.com/@joycelin.codes/quickstart-for-react-and-webpack-in-8-minutes-or-less-eb736da7480b
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, "./client/src/app.js"),
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "./public"),
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'env']
        }
      }
    ]
  }
};
