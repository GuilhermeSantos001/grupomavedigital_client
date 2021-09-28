const wp = require('@cypress/webpack-preprocessor')
const { cypressBrowserPermissionsPlugin } = require('cypress-browser-permissions')
const path = require('path');
const fs = require('fs');

function getConfigurationByFile(file) {
    const pathToConfigFile = path.resolve('cypress/config', `${file}.json`);
    return fs.readFileSync(pathToConfigFile, 'utf8');
}

module.exports = (on, config) => {
    const options = {
        webpackOptions: {
            resolve: {
                extensions: [".ts", ".tsx", ".js"]
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        exclude: [/node_modules/],
                        use: [{
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env', '@babel/preset-typescript'],
                                plugins: [
                                    [
                                        "module-resolver", {
                                            "root": ['../../'],
                                            "alias": {
                                                "@/src": "./src"
                                            }
                                        }
                                    ],
                                    '@babel/plugin-transform-typescript'
                                ]
                            },
                        }],
                    }
                ]
            }
        },
    }

    on('file:preprocessor', wp(options))
    on('task', {
        getConfiguration(fileName) {
            const file = fileName || config.env.configFile || 'qa'; // filename defaults
            return JSON.parse(getConfigurationByFile(file));
        }
    })

    config = cypressBrowserPermissionsPlugin(on, config);
    return config;
}