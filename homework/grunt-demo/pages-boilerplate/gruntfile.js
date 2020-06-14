// 实现这个项目的构建任务
// "clean": "grunt clean",
// "lint": "grunt lint",
// "serve": "grunt serve",
// "build": "grunt build",
// "start": "grunt start",
// "deploy": "grunt deploy --production"


const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')
const swig = require('swig')
const useref = require('useref')

let config = {
    build: {
        src: 'src',
        dist: 'dist',
        temp: '.temp',
        public: 'public',
        htmlmin: 'htmlmin', // 保存压缩的html文件
        paths: {
            styles: 'assets/styles/*.scss',
            scripts: 'assets/scripts/*.js',
            pages: '*.html',
            images: 'assets/images/*',
            fonts: 'assets/fonts/*'
        }
    },
    data: {
        menus: [
            {
                name: 'Home',
                icon: 'aperture',
                link: 'index.html'
            },
            {
                name: 'Features',
                link: 'features.html'
            },
            {
                name: 'About',
                link: 'about.html'
            },
            {
                name: 'Contact',
                link: '#',
                children: [
                {
                    name: 'Twitter',
                    link: 'https://twitter.com/w_zce'
                },
                {
                    name: 'About',
                    link: 'https://weibo.com/zceme'
                },
                {
                    name: 'divider'
                },
                {
                    name: 'About',
                    link: 'https://github.com/zce'
                }
                ]
            }
        ],
        pkg: require('./package.json'),
        date: new Date()
    }
}

module.exports = grunt => {
    grunt.initConfig({
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            main: {
                files: [{
                    expand: true,
                    cwd: config.build.src,
                    src: config.build.paths.styles,
                    dest: config.build.temp,
                    ext: '.css'
                }]
            }
        },
        babel: {
            options: {
                presets: ['@babel/preset-env']
            },
            main: {
                files: [{
                    expand: true,
                    cwd: config.build.src,
                    src: config.build.paths.scripts,
                    dest: config.build.temp,
                    ext: '.js'
                }]
            }
        },
        web_swig: {
            options: {
              swigOptions:{
                cache: false
              },
              getData: function(tpl){
                  return config.data
              }
            },
            develop: {
                expand: true,
                cwd: config.build.src,
                src: config.build.paths.pages,
                dest: config.build.temp,
                ext: '.html'
            }            
        },
        copy: {
            public: {
                files:[{
                    expand: true,
                    src: ['**'],
                    cwd: config.build.public,
                    dest: config.build.dist
                }]
            },
            temp: {
                files:[{
                    expand: true,
                    src: ['**'],
                    cwd: config.build.temp,
                    dest: config.build.dist
                }]
            }
        },
        useref: {
            // specify which files contain the build blocks
            html: 'src/*.html',
            // explicitly specify the temp directory you are working in
            // this is the the base of your links ( "/" )
            temp: config.build.temp
        },
        concat: {
            options: {
              separator: ';',
            },
            dist: {
                cwd: config.build.temp,
                src: config.build.paths.pages,
                dest: config.build.dist
            },
        },
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3 //定义 PNG 图片优化水平 0-7
                },
                files: [{
                    expand: true,
                    cwd: config.build.src,
                    src: [config.build.paths.images], // 优化 img 目录下所有图片
                    dest: config.build.dist // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                }]
            }
        },
        clean: {
            src: [config.build.dist,config.build.temp,config.build.htmlmin]
        },
        connect: {
            options: {
              port: 5210, 
              hostname: 'localhost', 
              livereload: 11111, // 声明给watch监听的端口
              
            },
            livereload: {
              options: {
                open: true,
              }
            },
            develop: {
                options: {
                    base:[config.build.temp, '.']
                }
            },
            production: {
                options: {
                    base:[config.build.dist, '.']
                }
            }
        },
        watch:{
            livereload: { //监听connect端口
                options: {
                  livereload: '<%= connect.options.livereload %>'
                },
                files: [
                  `${config.build.temp}/**`
                ]
            },
            css: {
                options:{cwd: config.build.src},
                files: [config.build.paths.styles],
                tasks: ['sass']
            },
            js: {
                options:{cwd: config.build.src},
                files: [config.build.paths.scripts],
                tasks: ['babel']
            },
            html: {
                options:{cwd: config.build.src},
                files: [config.build.paths.pages],
                tasks: ['web_swig']
            }
        },
    })

    loadGruntTasks(grunt) 

    grunt.registerTask('compile', ['sass','babel','web_swig'])

    grunt.registerTask('build', ['compile','copy'])

    grunt.registerTask('serve', ['compile','connect:develop','watch'])

    grunt.registerTask('start', ['build','connect:production', 'watch'])
    
}