import { resolve } from "path";

export async function create(projectName) {
  // 命令运行时的目录
  const cwd = process.cwd();
  // 目录拼接项目名
  const targetDir = resolve(cwd, projectName || ".");
  console.log(`创建项目的目录路径: ${targetDir}`);
}
