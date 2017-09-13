module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    var serveStatic = require('serve-static'),
        /**
         * 本地模式: API_NAME配置成 api，DEVELOP_MODE配置为 true
         * 代理模式: API_NAME配置成provider，DEVELOP_MODE配置为 false
         * */
        API_NAME = 'provider',
        proxyRewrite = {
            '^/provider/': '/provider/'
        },
        getReplaceOptions = function () {
            var DEVELOP_MODE = false,
                CONTEXT_PATH = '';
            return {
                patterns: [
                    {
                        match: 'DEVELOP_MODE',
                        replacement: DEVELOP_MODE
                    },
                    {
                        match: 'CONTEXT_PATH',
                        replacement: CONTEXT_PATH
                    },
                    {
                        match: 'API_NAME',
                        replacement: API_NAME
                    }
                ]
            }
        };

    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            copy: {
                js: {
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*'],
                    dest: 'dist/'
                }
            },
            watch: {
                options: {
                    livereload: true
                },
                js: {
                    files: 'src/**/*.js',
                    tasks: ['copy:js','replace:js']
                }
            },
            connect: {
                options: {
                    port: '9000',
                    hostname: 'localhost',
                    protocol: 'http',
                    open: true,
                    base: {
                        path: './app/',
                        options: {
                            index: 'index.html'
                        }
                    },
                    livereload: true
                },
                proxies: [
                    {
                        context: '/api/v1',
                        host: '192.168.150.9',
                        port: '5000',
                        https: false,
                        changeOrigin: true,
                        rewrite: proxyRewrite
                    }
                ],
                default: {},
                proxy: {
                    options: {
                        middleware: function (connect, options) {
                            if (!Array.isArray(options.base)) {
                                options.base = [options.base];
                            }

                            // Setup the proxy
                            var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

                            // Serve static files.
                            options.base.forEach(function (base) {
                                middlewares.push(serveStatic(base.path, base.options));
                            });

                            // Make directory browse-able.
                            /*var directory = options.directory || options.base[options.base.length - 1];
                             middlewares.push(connect.directory(directory));
                             */
                            return middlewares;
                        }
                    }
                }
            },
            replace: {
                options: getReplaceOptions(),
                js: {
                    expand: true,
                    cwd: 'dist/js/',
                    src: ['**/*.js'],
                    dest: 'dist/js/'
                }
            }
        }
    );

    grunt.registerTask('default', '启动代理服务......', function () {
        grunt.task.run([
            'copy',
            'replace',
            'configureProxies:proxy',
            'connect:proxy',
            'watch'
        ]);
    });
};
