const path = require('path')
const config = {
  webpackConfig: Object.assign({},
    require('./build/webpack.base.conf.js')
  ),
  styleguideDir: './documentation',
  require: [
    // Style
    path.join(__dirname, 'src/stylesheets/styleguide.scss')
  ]
}

// Add additionnal scss loader for scss files
config.webpackConfig.module.rules.push({
  test: /\.scss$/,
  use: [
    {
      loader: 'style-loader' // creates style nodes from JS strings
    },
    {
      loader: 'css-loader' // translates CSS into CommonJS
    },
    {
      loader: 'sass-loader' // compiles Sass to CSS
    }
  ]
})

module.exports = config
