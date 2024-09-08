const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // Import the CleanWebpackPlugin


module.exports = {
  mode: 'development', // Change to 'production' for production builds
  entry: {
    background: './src/background.js',
    content: './src/content.js',
    popup: './src/index.jsx', // Main entry for your React popup
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // Output files will be named according to entry points
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean the dist folder before each build
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'popup.html',
      chunks: ['popup'], // Only include the index.js bundle
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' }
      ],
    }),
  ],
  devtool: 'source-map',
  watch: process.env.NODE_ENV === 'development' // Watch mode based on environment
};
