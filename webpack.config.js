const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
	mode: 'production', // Может быть 'production' или 'development'
	entry: './src/main.ts',
	output: {
		filename: 'script.js',
		path: path.resolve(__dirname, 'build'),
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new Dotenv(),
	],
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.scss$/, // Добавляем правило для файлов SCSS
				use: [
					'style-loader', // Вставляет стили в DOM при запуске приложения (подходит для разработки)
					'css-loader', // Загружает CSS в JavaScript
					'sass-loader', // Компилирует SCSS в CSS
				],
			},
		],
	},
	watch: true,
};
