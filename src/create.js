import inquirer from "inquirer";
import { resolve } from "path";

import { defaults } from "./config/preset.js";
import { getPromptModules } from "./config/prompt.js";
import { PromptModuleAPI } from "./PromptModuleAPI.js";

export class Creator {
  constructor(name, context) {
    // 项目名称
    this.name = name;
    // 项目路径，含名称
    this.context = process.env.YUN_CLI_CONTEXT = context;
    // 存放 package.json 数据
    this.pkg = {};
    // 包管理工具
    this.pm = null;

    // 预设提示选项
    this.presetPrompt = this.resolvePresetPrompts();

    // 自定义特性提示选项（复选框）
    this.featurePrompt = this.resolveFeaturePrompts();

    const promptAPI = new PromptModuleAPI(this);
    const promptModules = getPromptModules();

    promptModules.then(pm => {
      pm.forEach(m => m.default(promptAPI));
      this.test();
    });
  }

  async test() {
    // 测试（仅为测试代码，用完需删除）
    inquirer
      .prompt(this.resolveFinalPrompts())
      .then(res => {
        console.log("选择的选项：");
        console.log(res);
      })
      .catch(error => {
        if (error.isTtyError) {
          console.log(">>>isTtyError>>>");
        } else {
          console.log("Something else went wrong");
        }
      })
      .finally(() => {
        console.log("test........");
      });
  }

  async create() {
    // 命令运行时的目录
    const cwd = process.cwd();
    // 目录拼接项目名
    const targetDir = resolve(cwd, this.name || ".");
    console.log(`创建项目的目录路径: ${targetDir}`);
  }

  // 获得预设的选项
  resolvePresetPrompts() {
    const presetChoices = Object.entries(defaults.presets).map(
      ([name, preset]) => {
        return {
          name: `${name}(${Object.keys(preset.plugins).join(",")})`, // 将预设的插件放到提示
          value: name,
        };
      }
    );

    return {
      name: "preset", // preset 记录用户选择的选项值。
      type: "list", // list 表单选
      message: `Please pick a preset:`,
      choices: [
        ...presetChoices, // Vue2 默认配置，Vue3 默认配置
        {
          name: "Manually select features", // 手动选择配置，自定义特性配置
          value: "__manual__",
        },
      ],
    };
  }

  resolveFinalPrompts() {
    const prompts = [this.presetPrompt, this.featurePrompt];
    return prompts;
  }

  // 自定义特性复选框
  resolveFeaturePrompts() {
    return {
      name: "features", // features 记录用户选择的选项值。
      when: answers => answers.preset === "__manual__", // 当选择"Manually select features"时，该提示显示
      type: "checkbox",
      message: "Check the features needed for your project:",
      choices: [], // 复选框值，待补充
      pageSize: 10,
    };
  }
}

export default Creator;
