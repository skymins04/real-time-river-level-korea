const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const sass = require("sass");

module.exports = {
  entry: path.resolve(__dirname, ".", "src", "index.tsx"),
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
    alias: {
      "@i18n": path.resolve(__dirname, ".", "src", "i18n"),
      "@Component": path.resolve(__dirname, ".", "src", "components"),
      "@Hook": path.resolve(__dirname, ".", "src", "hooks"),
      "@Lib": path.resolve(__dirname, ".", "src", "libs"),
      "@Redux": path.resolve(__dirname, ".", "src", "redux"),
      "@Layout": path.resolve(__dirname, ".", "src", "layouts"),
      "@Public": path.resolve(__dirname, ".", "public"),
    },
  },
  output: {
    path: path.resolve(__dirname, ".", "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: sass,
            },
          },
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: "asset/inline",
      },
      {
        test: /\.svg$/,
        type: "javascript/auto",
        use: ["@svgr/webpack"],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: `[name].css` })],
};
