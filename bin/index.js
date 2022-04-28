#! /usr/bin/env node

// 使用Node开发命令行工具所执行JavaScript脚本必须在顶部加入 #! /usr/bin/env node

const { program } = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const fs = require('fs');

const templates = {
  'template-vue' : {
    url: 'https://github.com/kiwiyan/vue-cli-add',
    downloadUrl: 'kiwiyan/vue-cli-add#master',
    description: 'vue模版'
  },
  'template-react' : {
    url: 'https://gitee.com/create-app-cli/template-react',
    downloadUrl: 'https://gitee.com:create-app-cli/template-react#master',
    description: 'react模版'
  }
};

//create-app init template-vue a-name基于template-vue模版进行初始化
//create-app init template-react a-name基于template-react模版进行初始化

program.version('1.0.1') // -v 或者 --versions输出版本号

program
  .command('init <template> <project>')
  .description('初始化项目模版')
  .action((templateName, projectName) => {
    // 下载之前做loading提示
    const spinner = ora('正在下载模版...').start()
    
    const {downloadUrl} = templates[templateName];
    //download 
    // 第一个参数： 仓库地址
    // 第二个参数： 下载路径
    download(downloadUrl, projectName, (err) => {
      if(err) {
        spinner.fail();
        console.log(logSymbols.error, chalk.red(err))
        return;
      }
      spinner.succeed(); // 下载成功提示
      // 把项目下的package.json文件读取出来
      // 使用向导的方式采集用户输入的数据解析导
      // 使用模板引擎把用户输入的数据解析到package.json 文件中
      // 解析完毕，把解析之后的结果重新写入package.json 文件中
      inquirer.prompt([
        {
          type: 'inpute',
          name: 'name',
          message: '请输入项目名称'
        },
        {
          type: 'inpute',
          name: 'description',
          message: '请输入项目简介'
        },
        {
          type: 'inpute',
          name: 'author',
          message: '请输入作者名称'
        }
    ]).then((answers) => {
      // const packagePath = `${projectName}/package.json`
      console.log('ans:', answers)
      // 对下载后的文件模板部分进行处理
      // const packageContent = fs.readFileSync(packagePath, 'utf8')
      // const packageResult = handlebars.compile(packageContent)(answers);
      // fs.writeFileSync(packagePath, packageResult)
      console.log(chalk.yellow('初始化模版成功'))
    })

    })
  })

program
  .command('list')
  .description('查看所有可用的模版')
  .action(() => {
    console.log(
      `template-vue vue模板
      template-react react模板`
    )
  })

program.parse(process.argv);
