var path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: ["./src/index.tsx"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.min.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader',"sass-loader"],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, './src/assets'),
    contentBasePublicPath: '/',
    historyApiFallback: true,
    hot:true
  }
};

module.exports = config;
