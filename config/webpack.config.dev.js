const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports =  {
  mode: 'development',
  watch: true,
  entry: {
    index: path.join(__dirname, '../src/index.js'),
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: "SubjectEditorPlugin"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: [autoprefixer()]
          }
        }, {
          loader: 'sass-loader'
        }]
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: 'static/images/[name].[ext]'
          }
        }
      },
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../src/index.html'),
      chunks: ['index'],
      inject: 'head'
    }),
  ],
  devServer: {
    inline: true,
    port: 8080,
    noInfo: false,
    hot: true
  }
}