const sass = require('sass')
const loadGruntTaks = require('load-grunt-tasks')
module.exports = grunt => {
    grunt.initConfig({
        sass: {
            options: {
                sourceMap: true,
                implementation: sass
            },
            main: {
                files: {
                    'dist/css/main.css': 'src/scss/main.scss'
                }
            }
        },
        babel: {
            options: {
                presets: ['@babel/preset-env'],
                sourceMap: true,
            },
            main: {
                files: {
                    'dist/js/app.js': 'src/js/app.js'
                }
            },
            
        },
        watch: {
            js: {
                files: ['src/js/*.js'],
                tasks: ['babel']
            },
            css: {
                files: ['src/scss/main.scss'],
                tasks: ['sass']
            }
        }
    })

    // grunt.loadNpmTasks('grunt-sass')
    loadGruntTaks(grunt) //自动加载所有的grunt插件中的任务

    grunt.registerTask('default', ['sass', 'babel', 'watch'])
}