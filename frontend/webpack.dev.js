const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env.dev") });

module.exports = merge(common, {
  mode: "development",
  devServer: {
    open: true,
  },
  devtool: "eval-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, ".", "public", "index.dev.html"),
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    new ReactRefreshWebpackPlugin(),
  ],
});
