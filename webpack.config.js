const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // Import the CleanWebpackPlugin

module.exports = {
  mode: 'development', // Change to 'production' for production builds
  entry: {
    background: './src/background.js',
    content: './src/content.js',
    popup: './src/index.jsx', // Main entry for your React popup
    options: './src/options.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // Output files will be named according to entry points
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      },
      {
        test: /\.module\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
                namedExport: false,
              },
              importLoaders: 2,
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
        include: path.resolve(__dirname, 'src'),
      },
      // other rules...
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
    new HtmlWebpackPlugin({
      template: './src/options.html',
      filename: 'options.html',
      chunks: ['options'], // Only include the options.js bundle
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/manifest.json', to: 'manifest.json' }],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public' }],
    }),
  ],
  watch: process.env.NODE_ENV === 'development', // Watch mode based on environment
}
