// 实现这个项目的构建任务
// "clean": "gulp clean",
// "lint": "gulp lint",
// "serve": "gulp serve",
// "build": "gulp build",
// "start": "gulp start",
// "deploy": "gulp deploy --production"
const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('gulp-load-plugins')
const bs = browserSync.create()

const plugins = loadPlugins()

const cwd = process.cwd()

let config = {
  build: {
    src: 'src',
    dist: 'dist',
    temp: '.temp',
    public: 'public',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**'
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

// try {
//   const loadConfig = require(`${cwd}/pages.config.js`)
//   config = Object.assign({}, config, loadConfig)
// } catch (e) {}

const clean = () => {
  return del([config.build.dist, config.build.temp])
}

const style = () => {
  return src(config.build.paths.styles, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.sass({ outputStyle: 'expanded' }).on('error', plugins.sass.logError))     // nested expanded compact compressed
    .pipe(dest(config.build.temp))
    .pipe( bs.reload( { stream: true } ) )
}

const script = () => {
  return src(config.build.paths.scripts, {  base: config.build.src, cwd: config.build.src })
    .pipe(plugins.babel({ presets: [require('@babel/preset-env')]}))
    .pipe(dest(config.build.temp))
    .pipe( bs.reload( { stream: true } ) )
}

const page = () => {
  return src(config.build.paths.pages, {  base: config.build.src, cwd: config.build.src })
    .pipe(plugins.swig({ data: config.data, defaults: { cache: false } }))
    .pipe(dest(config.build.temp))
    .pipe( bs.reload( { stream: true } ) )
}

const image = () => {
  return src(config.build.paths.images, {  base: config.build.src, cwd: config.build.src })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

const font = () => {
  return src(config.build.paths.fonts, {  base: config.build.src, cwd: config.build.src })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

const extra = () => {
  return src('**', {base: config.build.public, cwd: config.build.public})
    .pipe(dest(config.build.dist))
}

const serve = () => {
  watch(config.build.paths.styles, {cwd: config.build.src}, style)
  watch(config.build.paths.scripts, {cwd: config.build.src}, script)
  watch(config.build.paths.pages, {cwd: config.build.src}, page)
  
  watch([
    config.build.paths.images,
    config.build.paths.fonts,
  ], { cwd: config.build.src }, bs.reload)

  watch('**', { cwd: config.build.public }, bs.reload)

  bs.init({
    notify: false,
    port: 5210,
    server:{
      baseDir: [config.build.temp, config.build.src, config.build.public],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

const useref = () => {
  return src(config.build.paths.pages, { base: config.build.temp, cwd: config.build.temp })
    .pipe(plugins.useref({ searchPath: [config.build.temp, '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/,plugins.autoprefixer()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss(
        {
            keepSpecialComments: '*' //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }
    )))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({ 
      collapseWhitespace: true,
      minifyCSS: true, 
      minifyJS: true 
    })))
    .pipe(dest(config.build.dist))
}

const eslint = () => {
    return src(config.build.paths.scripts, { base: config.build.src, cwd: config.build.src })
            .pipe(plugins.eslint())
            .pipe(plugins.eslint.formatEach())
            // .pipe(plugins.eslint.failAfterError())
}

const stylelint = () => {
    return src(config.build.paths.styles, { base: config.build.src, cwd: config.build.src })
            .pipe(plugins.stylelint(
                    {
                        ailAfterError: true,
                        // reportOutputDir: 'reports/lint',
                        reporters: [
                            {formatter: 'string',console: true}
                            // {formatter:'json', save:'report.json'},
                        ],
                        debug: true
                    }
                )
            )
}

const upload = () => {
    return src('dist/**')
        .pipe(plugins.ghPages({
            remoteUrl: 'https://github.com/rogerloo/fed-e-task-02-01.git',
            branch: 'gulpDemo'
        }))
}

const lint = parallel(eslint, stylelint)

const compile = parallel(style, script, page)

const build = series(
  clean, 
  parallel(
    series(compile, useref), 
    image, 
    font,
    extra
  )
)

const start = series(compile, serve)

const deploy = series(build, upload)

module.exports = {
  clean,
  build,
  serve,
  start,
  lint,
  deploy
}