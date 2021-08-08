const webpack = require('webpack')

const config = require('./webpack.config')

webpack(config, error => {
    if (error) {
        throw error
    }
})
