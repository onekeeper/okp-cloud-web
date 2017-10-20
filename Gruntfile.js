// Generated on 2016-06-14 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app:  'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
	  js: {
        files: ['<%= yeoman.app %>/src/js/{,*/,**/}*.js'],
        //tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/src/css/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/views/*/*.html',
          '<%= yeoman.app %>/src/css/{,*/}*.css',
          '<%= yeoman.app %>/src/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/src/js/lib',
                connect.static('./src/js/lib')
              ),
              connect().use(
                '/app/src/css',
                connect.static('./app/src/css')
              ),
              connect.static(appConfig.app)  //临时改成发布目录，用于验证发布情况
            ];
          }
        }
      },
	  dist: {
			options: {
				open: true,
				port: 9001,
				hostname: 'localhost',
				base: '<%= yeoman.dist %>',
				livereload: 35728
			}
	  }
    },



    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '.zip',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
              detect: {
                js: /'(.*\.js)'/gi
              },
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/src/js/*.js',
          '<%= yeoman.dist %>/src/css/mod/{,*/}*.css',
          '<%= yeoman.dist %>/src/css/*.css',
          '<%= yeoman.dist %>/src/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'//,
          //'<%= yeoman.dist %>/src/fonts/*',
		  //'<%= yeoman.dist %>/views/{,*/}*.html'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html','<%= yeoman.dist %>/views/{,*/}*.html'],
      css : ['<%= yeoman.dist %>/src/css/{,*/}*.css','<%= yeoman.dist %>/src/css/mod/{,*/}*.css'],
      js: ['<%= yeoman.dist %>/src/js/*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/src/images/',
          '<%= yeoman.dist %>/src/images/*/',
          '<%= yeoman.dist %>/src/css/'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    cssmin: {
      compress: {
        files: {
          '<%= yeoman.dist %>/src/css/oneKeeper.min.css': [
              '<%= yeoman.app %>/src/css/main.css',
              '<%= yeoman.app %>/src/css/login.css',
              '<%= yeoman.app %>/src/css/userMgr.css',
              '<%= yeoman.app %>/src/css/sysConfig.css'
          ],
            '<%= yeoman.dist %>/src/css/mod/oneKeeperMod.min.css': [
            '<%= yeoman.app %>/src/css/mod/{,*/}*.css'
          ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/src/js/scripts.js': ['<%= yeoman.dist %>/src/js/scripts.js']
        }
      }
    },
    concat: {
        options: {
            separator: ''  //分隔符：;
        },
        dist: {
            src: ['<%= yeoman.app %>/src/js/app.js',
			      '<%= yeoman.app %>/src/js/services/{,*/}*.js',
                  '<%= yeoman.app %>/src/js/controllers/{,*/}*.js',
                  '<%= yeoman.app %>/src/js/directives/{,*/}*.js',
                  '<%= yeoman.app %>/src/js/filters/{,*/}*.js'
            ],
            dest: '<%= yeoman.dist %>/src/js/scripts.js'
        }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/src/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/src/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/src/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/src/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'views/{,*/}*.html',
            'src/js/lib/**',
            'src/js/map/**',
            'src/js/toolBox.js',
            'src/js/toolDetail.js',
            'src/js/plugin/**',
            'src/css/lib/**',
            'src/css/map/**',
            'src/css/toolBox.css',
            'src/fonts/**',
            'src/images/**'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    jshint: {
      options: {
          // //大括号包裹
          // curly: true,
          //对于简单类型，使用===和!==，而不是==和!=
          eqeqeq: false,
          // //对于首字母大写的函数（声明的类），强制使用new
          // newcap: true,
          // //禁用arguments.caller和arguments.callee
          // noarg: false,
          //对于属性使用aaa.bbb而不是aaa['bbb']
          sub: true,
          // //查找所有未定义变量
          // undef: true,
          // //查找类似与if(a = 0)这样的代码
          // boss: true,
          // //指定运行环境为node.js
          // node: true,
          "globals": {
              "jQuery": true,
              "$": true,
              "angular": true
          },
          browser: true,            // browser environment
          devel: true               //
      },
      //具体任务配置
      beforeConcat: [
          '<%= yeoman.app %>/src/js/controllers/{,*/}*.js',
          '<%= yeoman.app %>/src/js/directives/{,*/}*.js',
          '<%= yeoman.app %>/src/js/services/{,*/}*.js',
          '<%= yeoman.app %>/src/js/filters/{,*/}*.js'
      ],
      afterConcat: ['<%= yeoman.dist %>/src/js/*.js'],
      afterUglify: ['<%= yeoman.dist %>/src/js/*.js']
    },

    compress: {
      main: {
          options: {
              archive: 'oneKeeperCloud.zip'
          },
          //files: [
              //{src: ['path/*'], dest: 'internal_folder/', filter: 'isFile'}, //path下所有的js
              //{src: ['<%= yeoman.dist %>/**'], dest: '<%= yeoman.dist %>/'} // path下的所有目录和文件
          //]
          files: [{
              expand: true,
              cwd: '<%= yeoman.dist %>/',
              src: ['**'],
              dest: '/app/'
          }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      //'wiredep',
      'concurrent:server',
      //'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('default', [
    'serve'
  ]);

  grunt.registerTask('publish', [
      'clean',
      'copy',
      'jshint:beforeConcat',
      'concat',//合并
      'jshint:afterConcat',
      'uglify',
      //'jshint:afterUglify',
      'cssmin',
      'filerev',
      'usemin',
      'htmlmin',
      'compress'
  ]);

  grunt.registerTask('prod', [
	'publish',
	'connect:dist',
	'watch'
  ]);

};
