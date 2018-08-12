'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //API_SERVER: '"http://123.56.17.227:8081"'
  API_SERVER: '"http://localhost:8080"'
})
