const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
    preview: './src/preview.ts',
  },
  output: {
    filename: chunkDdata => {
      // return chunkDdata.chunk.name == 'preview' ? '[name].js' : '[name].[hash].js'
      return '[name].js'
    },
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },

  devtool: 'cheap-module-eval-source-map ',
  devServer: {
    contentBase: 'dist',
    hot: true,
  },

  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(styl|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development',
              // reloadAll: true,
            },
          },
          'css-loader',
          'stylus-loader',
        ],
      },
    ],
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      title: 'develop',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'preview.html',
      template: 'src/preview.html',
      chunks: ['preview'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
