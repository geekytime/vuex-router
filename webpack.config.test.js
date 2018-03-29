/* eslint-env node */
const config = require("./webpack.config.js")
const glob = require("glob")
const path = require("path")
const WebpackTapeRun = require("webpack-tape-run")

module.exports = {
  target: "web",
  entry: glob.sync("./test/*.test.js"),
  node: {
    fs: "empty"
  },
  output: {
    path: path.resolve(__dirname, ".test"),
    filename: "test.js"
  },
  module: config.module,
  stats: "errors-only",
  plugins: [
    new WebpackTapeRun({
      tapeRun: {
        browser: "electron"
      }
    })
  ],
  mode: "development"
}
