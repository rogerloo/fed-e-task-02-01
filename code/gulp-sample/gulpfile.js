// gulp入口文件

exports.foo = done =>{
    console.log('123123')
    done()
}

exports.default = done => {
    console.log('default')
    done()
}

const gulp = require('gulp')

gulp.task('bar', done=>{
    console.log('bar')
    done()
})

exports.callback_error = done => {
    console.log('callback_error')
    done(new Error('task failed!'))
}

exports.promise_error = () => {
    console.log('promise_error')
    return Promise.reject(new Error('task failed!'))
}

const timout = time => {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}
exports.async = async () => {
    await timout(1000)
    console.log('async task!')
}

const fs = require('fs')

exports.stream = () => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('temp.txt')
    readStream.pipe(writeStream)
    return readStream
}

exports.stream2 = done => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('temp.txt')
    readStream.pipe(writeStream)
    readStream.on('end', （ => {
        done()
    })
}

const { Transform } = require('stream')

exports.transformStream = () => {
    const readStream = fs.createReadStream('package.json')
    const transform = new Transform({
        transform: (chunk, encoding, callback) => {
            const input = chunk.toString()
            const output = input.replace(/\+/g, '').replace(/\/\*.+?\*\//g, '')
            callback(null, output) //错误优先 第一个参数可传入Error对象
        }
    })
    const writeStream = fs.createWriteStream('temp.txt')
    readStream
        .pipe(transform)
        .pipe(writeStream)
    return readStream
}

const { src, dest } = require('gulp')
const cleadCss = require('gulp-clean-css')
const rename = require('gulp-rename')

exports.default = () => {
    return src('src/*.css')
        .pipe(cleadCss())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(dest('dist'))
}