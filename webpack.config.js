const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const webpack = require("webpack");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "bytebank",
    projectName: "transaction",
    webpackConfigEnv,
    argv,
    outputSystemJS: false,
  });

  return merge(defaultConfig, {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.VITE_API_BASE_URL": JSON.stringify(
          process.env.VITE_API_BASE_URL || "http://localhost:3000"
        ),
      }),
    ],
    externals: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
    },
  });
};
