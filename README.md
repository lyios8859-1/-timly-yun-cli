# 打造一款属于自己的脚手架（CLI）工具

> 脚手架是一种自动化工具，可以帮助我们快速搭建工程化项目。

## 一些交互工具

> 一个友好的脚手架工具，在开发过程中使用到一些辅助工具库，比如***交互提示，获取用户输入，高亮，生成模板***等等。

- commander
  - 一个命令行解决方案。通过它可以告诉用户脚手架的命令与功能，以及处理用户输入。

- chalk
  - 一个终端字符串美化工具。

- inquirer
  - 一个交互式命令行界面。提供了询问操作者问题，获取并解析用户输入，多层级的提示，提供错误回调，检测用户回答是否合法等能力。

- ejs
  - 一个高效的嵌入式 JavaScript 模板引擎。模板可以通过数据进行动态渲染。

## 项目搭建

### 初始化 package.json

1. 新建项目目录 timly-yun-cli 与 package.json 文件。

```sh
mkdir timly-yun-cli
cd timly-yun-cli
npm init
```

需要使用命令，则需要添加 bin 信息，bin 是配置命令名与脚本路径。命令名是 `@timly/yun-cli`，脚本路径是 bin/main.js，包名为 @timly/yun-cli。

```json
{
  "name": "@timly/yun-cli",
  "type": "module",
+  "bin": {
+    "@timly/yun-cli": "bin/main.js"
+  },
}
```

### 脚本文件 `bin/main.js`

> 脚本文件 `bin/main.js`，用 `commander` 来向用户展示脚手架功能，用 `chalk` 来处理控制台高亮显示。该文件主要是处理交互与显示。脚手架的核心逻辑放到 `src/create.js`。

***脚本：bin/main.js***

```js
#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";

import { create } from "../src/create.js";
import { log } from "../src/utils.js";

const program = new Command();

program
  .name("@timly/yun-cli")
  .description("一个神奇的项目自动化构建构建工具^_^")
  .usage("<command> [options]")
  .version("0.0.1");

program
  .command("create")
  .description("创建项目")
  .argument("<app-name>", "项目名称") // [xxx] xxx可选，<xxx> xxx必须
  .action((str, options) => {
    log(chalk.bold.blue(`Next CLI v0.0.1`));
    create(str, options);
  });

program.on("--help", () => {
  log(
    `\n  Run ${chalk.yellow(
      `@timly/yun-cli <command> --help`
    )} for detailed usage of given command.\n`
  );
});

program.parse(process.argv);
```

***src/create.js***

简单实现打印路径和项目名

```js
import { resolve } from "path";

export async function create(projectName) {
  // 命令运行时的目录
  const cwd = process.cwd();
  // 目录拼接项目名
  const targetDir = resolve(cwd, projectName || ".");
  console.log(`创建项目的目录路径: ${targetDir}`);
}
```

## 建立链接

> 为了方便使用，都是通过***软链接***到全局执行环境然后使用，起到全局变量的作用。

用 npm link 命令可以将该 npm 包与命令软链接到全局执行环境，从而在任意位置可直接使用该命令。

```sh
npm link
```

PS：我这里就不使用这种方式了，直接运行脚本设置参数。

```sh
npm run dev -- create xxx
```
