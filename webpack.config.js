/* eslint-env node */
const path = require("path")

module.exports = {
  entry: {
    app: ["./lib/index.js"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "vuex-router-min.js",
    publicPath: "/"
  },
  resolve: {
    symlinks: false
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: ["babel-loader"],
      exclude: /(node_modules)/,
    },{
      test: /\.less|\.css$/,
      use: [
        "style-loader",
        "css-loader",
        "less-loader"
      ]
    },{
      test: /\.vue$/,
      loader: "vue-loader"
    }]
  },
  node: {
    fs: "empty"
  },
  mode: "production"
}
