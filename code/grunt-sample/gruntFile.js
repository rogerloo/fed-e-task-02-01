// Grunt的入口文件
// 用于定义一些需要Grunt自动执行的任务
// 需要导出一个函数
// 此函数接收一个Grunt的形参，内部提供一些创建任务时可以用到的API

module.exports = grunt => {
    grunt.registerTask('foo', ()=>{
        console.log('hhhhhh')
    })

    grunt.registerTask('bar', '描述', ()=>{
        console.log('dsdsada')
    })

    // grunt.registerTask('default', ['foo', 'bar'])

    // grunt.registerTask('async-task', ()=>{
    //     setTimeout(() => {
    //         console.log('async-task')
    //     }, 1000);
    // })

    grunt.registerTask('async-task', function(){
        const done = this.async()
        setTimeout(() => {
            console.log('async-task')
            done()
        }, 1000);
    })

    grunt.registerTask('bad',  ()=>{
        console.log('bad')
        return false
    })
    grunt.registerTask('default', ['foo','bad', 'bar'])

    grunt.registerTask('bad-task', function(){
        const done = this.async()
        setTimeout(() => {
            console.log('bad-task')
            done(false)
        }, 1000);
    })

    grunt.initConfig({
        haha: {
            bar: 1233
        },
        build: {
            options: {
                foo: 'bar'
            },
            css: {
                options: {
                    foo: 'baz'
                },
            },
            js: '2',
            vue: '3'
        },
        clean: {
            // temp: 'temp/app.js'
            // temp: 'temp/*.txt'
            temp: 'temp/**'
        }
    })

    grunt.registerTask("haha", ()=>{
        console.log(grunt.config('haha.bar'))
    })

    grunt.registerMultiTask('build', function(){
        // console.log('build')
        console.log(this.options())
        console.log(`target:${this.target}, data: ${this.data}`)
    })

    grunt.loadNpmTasks('grunt-contrib-clean')
}