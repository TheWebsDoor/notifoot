var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

module.exports = {
    configureWebpack: {
        plugins: [
            new SWPrecacheWebpackPlugin({
                cacheId: 'notifoot',
                filename: 'service-worker.js',
                staticFileGlobs: ['dist/**/*.{js,html,css,png,svg}'],
                minify: true,
                stripPrefix: 'dist/'
            })
        ]
    }
}