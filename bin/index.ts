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

/** Pilihan level pertama */
type MainTemplateChoice =
  | "next-js-fullstack"
  | "next-js-frontend"
  | "vue"
  | "php native";

/** Template folder final yang ada di /templates */
type TemplateChoice =
  | "next-js-fullstack-with-mongodb"
  | "next-js-fullstack-with-firebase"
  | "next-js-frontend"
  | "vue-dynamic-page"
  | "vue-landing-page"
  | "php-native-landing";

/** Root folder CLI (berbeda saat dev vs build) */
const cliRoot = fs.existsSync(path.join(__dirname, "..", "templates"))
  ? path.join(__dirname, "..")
  : path.join(__dirname, "..", "..");

program.name("rizki").description("Rizki Personal CLI").version("1.0.0");

program
  .command("create")
  .argument("<project-name>")
  .action(async (projectName: string) => {
    const mainTemplateChoices = [
      "next-js-fullstack",
      "next-js-frontend",
      "vue",
      "php native",
    ] as const;

    // Pilihan pertama: kategori besar
    const { mainTemplate } = await inquirer.prompt<{
      mainTemplate: MainTemplateChoice;
    }>([
      {
        type: "rawlist",
        name: "mainTemplate",
        message: "Pilih template:",
        choices: mainTemplateChoices,
        default: 0,
      },
    ]);

    // Pilihan kedua: detail berdasarkan pilihan pertama
    let selectedTemplate: TemplateChoice;

    if (mainTemplate === "next-js-fullstack") {
      const { fullstackVariant } = await inquirer.prompt<{
        fullstackVariant: TemplateChoice;
      }>([
        {
          type: "rawlist",
          name: "fullstackVariant",
          message: "Pilih varian Next.js fullstack:",
          choices: [
            {
              name: "Next.js Fullstack + MongoDB",
              value: "next-js-fullstack-with-mongodb",
            },
            {
              name: "Next.js Fullstack + Firebase",
              value: "next-js-fullstack-with-firebase",
            },
          ],
          default: 0,
        },
      ]);

      selectedTemplate = fullstackVariant;
    } else if (mainTemplate === "vue") {
      const { vueVariant } = await inquirer.prompt<{
        vueVariant: TemplateChoice;
      }>([
        {
          type: "rawlist",
          name: "vueVariant",
          message: "Pilih varian Vue:",
          choices: [
            {
              name: "Vue Landing Page",
              value: "vue-landing-page",
            },
            {
              name: "Vue Dynamic Page",
              value: "vue-dynamic-page",
            },
          ],
          default: 0,
        },
      ]);

      selectedTemplate = vueVariant;
    } else if (mainTemplate === "php native") {
      const { phpVariant } = await inquirer.prompt<{
        phpVariant: TemplateChoice;
      }>([
        {
          type: "rawlist",
          name: "phpVariant",
          message: "Pilih varian PHP:",
          choices: [
            {
              name: "PHP Native Landing",
              value: "php-native-landing",
            },
          ],
          default: 0,
        },
      ]);

      selectedTemplate = phpVariant;
    } else {
      // Untuk selain fullstack, vue & php, nama folder = nama pilihan pertama
      selectedTemplate = mainTemplate as TemplateChoice;
    }

    const templatePath = path.join(cliRoot, "templates", selectedTemplate);

    const cwd = process.cwd();
    const targetPath = projectName === "." ? cwd : path.join(cwd, projectName);

    if (projectName === ".") {
      const existingFiles = await fs.readdir(targetPath);
      if (existingFiles.length > 0) {
        console.log(
          chalk.red(
            "Folder saat ini tidak kosong. Jalankan di folder kosong atau gunakan nama project baru.",
          ),
        );
        process.exit(1);
      }
    } else if (fs.existsSync(targetPath)) {
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
