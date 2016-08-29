var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');

module.exports = {
	entry: [
		'webpack/hot/only-dev-server',
		'./src/index.jsx' // Your appʼs entry point
	],
	devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
	output: {
		path: __dirname + '/build',
		publicPath: '/',
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	postcss() {
		return [require('precss'), require('autoprefixer')]
	},
	module: {
		loaders: loaders
	},
	devServer: {
		historyApiFallback: true,
		contentBase: './build',
		hot: true,
		stats: {
				colors: true,
				chunks: false
		},
		proxy: {},
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	]
};
