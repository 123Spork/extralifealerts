var path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

var config = {
  entry: ['./src/index.tsx', __dirname + '/src/main.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.min.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'file-loader',
            options: { outputPath: '.', name: 'style.min.css' }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'expanded'
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/assets/'),
          to: path.resolve(__dirname, "./dist/assets/"),
        },
        {
          from: path.resolve('./src/config.js'),
          to: path.resolve('./dist/config.js'),
          toType: 'file'
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    contentBasePublicPath: '/',
    historyApiFallback: true,
    hot: true
  },
  optimization: {
    minimize: false
  }
}

module.exports = config
