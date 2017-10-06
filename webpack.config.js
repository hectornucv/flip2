// webpack.config.js
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var $ = require("jquery");
var autoprefixer = require('autoprefixer');
var libraryName = 'flip2win';
var outputFile = libraryName + '.js';
/*var precss       = require('precss');
*/
module.exports = {
 /* devServer: {
        inline: true,
        contentBase: './',
        port: 3001
    },*/
    entry: ["./assets/js/main.js"],
    output: {
        path: __dirname+'/dist/',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
     },
     { test: /\.scss$/,
       use: ExtractTextPlugin.extract(
                    { fallback: 'style-loader',
                      use: ['css-loader', 'sass-loader']
                    })
     },
     {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: ['file-loader?name=fonts/[name].[ext]']
     },
     {
        test: /\.(png|jpg|jpeg|bmp)$/,
        use: ['file-loader?name=/images/[name].[ext]']
     }

    ]
  },
  plugins: [
        new ExtractTextPlugin("flip2win.css"),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': 'jquery'
        }),
        // new webpack.optimize.CommonsChunkPlugin("vendor-page1", "vendor-page1.js", Infinity)
        new BrowserSyncPlugin(
        // BrowserSync options 
        {
          // browse to http://localhost:3000/ during development 
          host: 'localhost',
          port: 3000,
          // proxy the Webpack Dev Server endpoint 
          // (which should be serving on http://localhost:3100/) 
          // through BrowserSync 
          proxy: 'http://localhost:8080/'
        },
        // plugin options 
        {
          // prevent BrowserSync from reloading the page 
          // and let Webpack Dev Server take care of this 
          reload: true
        }
      )
    ],
    resolve: {
      modules:[
        path.join(__dirname,'/jquery/src/jquery'),
        "node_modules"
      ]
    }
};