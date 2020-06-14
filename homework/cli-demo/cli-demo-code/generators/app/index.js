const Generator = require('yeoman-generator')
const path = require('path')
const fs = require('fs');
const { read } = require('../../utils')
module.exports = class extends Generator {
    prompting(){
        return this.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Your Project Name',
                default: this.appname
            },
            {
                type: 'input',
                name: 'projectDes',
                message: 'Your Project description',
                default: ''
            },
            {
                type: "confirm",
                message: "是否使用css预编译器?",
                name: "needCssPre"
            },
            {
                type: 'rawlist',
                message: '请选择css预编译器:',
                name: 'CssPre',
                choices: [
                    "sass",
                    "less",
                    "stylus"
                ],
                when: function(answers) { 
                    return answers.needCssPre
                }
            },
        ])
        .then( res => {
            this.answers = res
        })
    }
    writing(){
        const sourceDir = path.join(this.templatePath(), './');
        const filePaths = read(sourceDir);
        filePaths.forEach(filePath => {
            this.fs.copyTpl(          
                this.templatePath('./' + filePath),
                this.destinationPath(filePath),
                this.answers
            );
        });

        // read(this.sourceRoot(), file => {
        //     console.log(file)
        // }, this)
        const pkgJson = {
            devDependencies: {
                [this.answers.CssPre]: 'latest'
            }
        };
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    }
    install() {
        this.yarnInstall();    // this.npmInstall();
    }
    end() {
        // 安装结束
        console.log('generator success');
    }
}