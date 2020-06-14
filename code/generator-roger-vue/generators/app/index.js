const Generator = require('yeoman-generator')

module.exports = class extends Generator {
    prompting(){
        return this.prompt([{
            type: 'input',
            name: 'name',
            message: 'Your Project Name',
            default: this.appname
        }]) 
        .then(answers => {
            this.answers = answers
        })
    }

    writing (){
        // 循环生成模板文件
        const templates = [
            '.gitignore',
            'README.md',
            'public/index.html',
            'src/main.js'
        ]

        templates.forEach(item => {
            this.fs.copyTpl(
                this.templatePath(item),
                this.destinationPath(item),
                this.answers
            )
        })
    }
}