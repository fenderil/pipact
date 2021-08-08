const path = require('path')
const express = require('express')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const webpackDevMiddleware = require('webpack-dev-middleware')

const config = require('./webpack.config')

const compiler = webpack(merge(
    config,
    {
        mode: 'development',
        entry: './fixture'
    }
))

express()
    .get('/', (req, res) => res.sendFile(path.resolve(process.cwd(), 'index.html')))
    .use(webpackDevMiddleware(compiler))
    .listen(4242, () => console.log('Start on http://localhost:4242'))
