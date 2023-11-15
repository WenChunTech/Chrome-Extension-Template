import webpack from 'webpack'
import { Request, Response } from 'webpack-dev-server'
import SSEStream from 'ssestream'
import { Compiler } from 'webpack-dev-server'
import commonConfig from './webpack.common'
import { merge } from 'webpack-merge'

const config: webpack.Configuration = {
    mode: 'development',
    entry: {
        background: ['./src/reload/Background'],
        contentScripts: ['./src/reload/ContentScript'],
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        hot: true,
        allowedHosts: 'all',
        devMiddleware: {
            writeToDisk: true,
        },
        setupMiddlewares: (middlewares, server) => {
            middlewares.unshift({
                name: 'reload',
                path: '/reload',
                middleware: (req: Request, res: Response) => {
                    console.log('reload request');
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
                }

            })
            return middlewares;
        }

    }
};

export default merge(commonConfig, config)
