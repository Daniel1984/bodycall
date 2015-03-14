module.exports = {
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
        'webpack/hot/only-dev-server',
        './app/main.js'
    ],
    ouput: {
        path: './build',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loaders: ['react-hot', 'jsx-loader?harmony'], exclude: /node_modules/ },
            { test: /\.less$/, loader: "style-loader!css-loader!less-loader" }
        ]
    }
};
