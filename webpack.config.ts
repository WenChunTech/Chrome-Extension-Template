import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import Server from 'webpack-dev-server'
import SSEStream from 'ssestream'
import { Compiler } from 'webpack-dev-server'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import * as path from 'path'
// import UnoCSS from '@unocss/webpack'

const rootDir = path.resolve(__dirname);
const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

const config: webpack.Configuration = {
    devtool: "cheap-module-source-map",
    mode: 'development',
    entry: {
        popup: './src/popup',
        background: ['./src/reload/Background', './src/background'],
        contentScripts: ['./src/contentScripts', './src/reload/ContentScript'],
    },
    output: {
        // publicPath: '/',
        path: path.resolve(rootDir, './dist/js'),
        filename: '[name].js',
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        hot: true,
        allowedHosts: 'all',
        devMiddleware: {
            writeToDisk: true,
        },
        onBeforeSetupMiddleware: (server: Server) => {
            server.app?.get('/reload', (req, res) => {
                const compiler = server.compiler as Compiler;
                const sseStream = new SSEStream(req);
                sseStream.pipe(res);
                let closed = false;
                const reloadPlugin = (stat: webpack.Stats) => {
                    console.log('stat is:', stat.hasErrors())
                    if (!closed) {
                        console.log('sse write data');
                        sseStream.write(
                            {
                                event: 'compiled',
                                data: 'reload extension and refresh current page'
                            },
                            'utf-8',
                            (err) => {
                                if (err) {
                                    console.log('sse write error', err);

                                }
                            });
                        setTimeout(() => sseStream.unpipe(res), 100);
                    }
                }

                compiler.hooks.done.tap('chrome plugin reload', reloadPlugin);
                res.on('close', () => {
                    closed = true;
                    sseStream.unpipe(res);
                    console.log('close sse stream');
                })
            })
        }
    },
    plugins: [
        // UnoCSS(),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public/manifest.json',
                    to: path.resolve(rootDir, 'dist/manifest.json'),
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(rootDir, 'public/index.html'),
            filename: path.resolve(rootDir, 'dist/index.html'),
            chunks: ['popup'],
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

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';

        config.plugins!.push(new MiniCssExtractPlugin());


    } else {
        config.mode = 'development';
    }
    return config;
};
