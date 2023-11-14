import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import commonConfig from './webpack.common'
import { merge } from 'webpack-merge'

const config: webpack.Configuration = {
    mode: 'production',
    plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/[name].css'
        })
    ]
};

export default merge(commonConfig, config);

