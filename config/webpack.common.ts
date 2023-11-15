import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import * as path from 'path'
import UnoCSS from '@unocss/webpack'

const rootDir = path.resolve(__dirname, '..');
const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

const config: webpack.Configuration = {
    devtool: "cheap-module-source-map",
    mode: 'development',
    entry: {
        popup: './src/popup',
        background: ['./src/background'],
        contentScripts: ['./src/contentScripts'],
    },
    output: {
        // publicPath: '',
        path: path.resolve(rootDir, './dist/js'),
        filename: '[name].js',
    },
    optimization: {
        realContentHash: true
    },
    plugins: [
        UnoCSS(),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public/manifest.json',
                    to: path.resolve(rootDir, 'dist'),
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(rootDir, 'public/index.html'),
            filename: path.resolve(rootDir, 'dist/popup/index.html'),
            chunks: ['popup']
        })
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
};

export default config
