const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    // Other rules...
    plugins: [
        new NodePolyfillPlugin()
    ],
    resolve: {
        fallback: {
            "fs": false,
            "tls": false,
            "net": false,
            "path": false,
            "zlib": false,
            "http": require.resolve('stream-http'), // For "http" module, use "stream-http" polyfill
            "https": require.resolve('https-browserify'), // For "https" module, use "https-browserify" polyfill
            "stream": require.resolve('stream-browserify'),
            "crypto": require.resolve('crypto-browserify'),
            "url": require.resolve('url'), // For "url" module, use "url" polyfill
        },
    },
};
