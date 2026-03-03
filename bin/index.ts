#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const program = new Command();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Template name pilihan user */
type TemplateChoice =
  | "next-js-fullstack"
  | "next-js-frontend"
  | "vue-dynamic-page"
  | "vue-landing-page";

/** Root folder CLI (berbeda saat dev vs build) */
const cliRoot = fs.existsSync(path.join(__dirname, "..", "templates"))
  ? path.join(__dirname, "..")
  : path.join(__dirname, "..", "..");

program.name("rizki").description("Rizki Personal CLI").version("1.0.0");

program
  .command("create")
  .argument("<project-name>")
  .action(async (projectName: string) => {
    const templateChoices = [
      "next-js-fullstack",
      "next-js-frontend",
      "vue-dynamic-page",
      "vue-landing-page",
    ] as const;

    const answers = await inquirer.prompt<{ template: TemplateChoice }>([
      {
        type: "rawlist",
        name: "template",
        message: "Pilih template:",
        choices: templateChoices,
        default: 0,
      },
    ]);

    const templatePath = path.join(cliRoot, "templates", answers.template);

    const targetPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(targetPath)) {
      console.log(chalk.red("Folder sudah ada!"));
      process.exit(1);
    }

    console.log(chalk.blue("Membuat project..."));
    await fs.copy(templatePath, targetPath);

    console.log(chalk.blue("Install dependencies..."));
    execSync("npm install", { cwd: targetPath, stdio: "inherit" });

    console.log(chalk.blue("Init git..."));
    execSync("git init", { cwd: targetPath, stdio: "inherit" });

    console.log(chalk.green("Project berhasil dibuat! 🚀"));
  });

program.parse();
