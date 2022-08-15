const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");
const dotenv = require("dotenv");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
dotenv.config({ path: path.resolve(__dirname, ".env.prod") });
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: "production",
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, ".", "public", "index.prod.html"),
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    // new BundleAnalyzerPlugin(),
  ],
});
