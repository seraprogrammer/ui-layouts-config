#!/usr/bin/env node

const { program } = require("commander");
const inquirer = require("inquirer").default;
const chalk = require("chalk").default;
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const open = require("open").default; // Use .default for CommonJS compatibility
const ora = require("ora").default;
const fetch = require("node-fetch");
const figlet = require("figlet");
const boxen = require("boxen").default;

const CONFIG_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".olova_config.json"
);

// Load or create config
const loadConfig = () => {
  if (fs.existsSync(CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  }
  return {};
};

const saveConfig = (config) => {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
};

// Check if Git is configured
const checkGitConfig = () => {
  try {
    const userName = execSync("git config user.name", { stdio: "pipe" })
      .toString()
      .trim();
    const userEmail = execSync("git config user.email", { stdio: "pipe" })
      .toString()
      .trim();
    return userName && userEmail;
  } catch (error) {
    return false;
  }
};

// Format time
const formatTime = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  const seconds = (ms / 1000).toFixed(2);
  return `${seconds}s`;
};

// Display banner
const showBanner = () => {
  console.log(
    chalk.cyan(figlet.textSync("Olova", { horizontalLayout: "full" }))
  );
};

// Verify deployment
const verifyDeployment = async (url) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Init command
program
  .command("init")
  .description("Initialize repository for deployment")
  .action(async () => {
    showBanner();
    try {
      if (!checkGitConfig()) {
        console.error(
          chalk.red(
            "✗ Git is not configured. Please set up Git first (git config user.name/user.email)"
          )
        );
        return;
      }

      const { repoUrl } = await inquirer.prompt([
        {
          type: "input",
          name: "repoUrl",
          message: "Enter your GitHub repository URL:",
          validate: (input) => {
            const regex =
              /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/;
            return (
              regex.test(input) || "Please enter a valid GitHub repository URL"
            );
          },
        },
      ]);

      const spinner = ora("Verifying repository access...").start();
      const startTime = Date.now();

      try {
        execSync(`git ls-remote ${repoUrl}`, { stdio: "pipe" });
        const duration = Date.now() - startTime;
        spinner.succeed(
          `Repository access verified! (${formatTime(duration)})`
        );

        const config = loadConfig();
        config.repoUrl = repoUrl;
        config.lastVerified = new Date().toISOString();
        saveConfig(config);
      } catch (error) {
        spinner.fail("Cannot access repository. Check URL and permissions");
        console.error(chalk.red(`Error: ${error.message}`));
        return;
      }

      console.log(
        boxen(
          chalk.green("Initialization complete!\n") +
            chalk.blue(`Repository: ${repoUrl}`),
          { padding: 1, margin: 1, borderStyle: "round", borderColor: "green" }
        )
      );
    } catch (error) {
      console.error(chalk.red("✗ Error during initialization:", error.message));
    }
  });

// Push command
program
  .command("push")
  .description("Deploy the repository as a page")
  .action(async () => {
    showBanner();
    try {
      const config = loadConfig();
      if (!config.repoUrl) {
        console.error(chalk.red('✗ Please run "olova init" first'));
        return;
      }

      try {
        execSync("git rev-parse --is-inside-work-tree", { stdio: "pipe" });
      } catch (error) {
        console.error(
          chalk.red(
            "✗ Not in a Git repository. Please run this command from your project directory"
          )
        );
        return;
      }

      const repoName = config.repoUrl.split("/").pop();
      const username = config.repoUrl.split("/")[3];
      const deployUrl = `https://${username}.github.io/${repoName}`;

      console.log(chalk.blue(`Target: ${config.repoUrl}`));
      const spinner = ora("Starting deployment...").start();
      const startTime = Date.now();

      try {
        const status = execSync("git status --porcelain", { stdio: "pipe" })
          .toString()
          .trim();
        if (status) {
          spinner.text = "Committing changes...";
          execSync("git add .", { stdio: "pipe" });
          execSync('git commit -m "Deploy via olova"', { stdio: "pipe" });
        }

        spinner.text = "Pushing to GitHub...";
        execSync("git push origin main", { stdio: "pipe" });

        spinner.text = "Waiting for deployment...";
        await new Promise((resolve) => setTimeout(resolve, 2000));

        spinner.text = "Verifying deployment...";
        const isLive = await verifyDeployment(deployUrl);

        const duration = Date.now() - startTime;
        spinner.succeed(`Deployment successful! (${formatTime(duration)})`);

        const deployInfo = [
          chalk.cyan(`URL: ${deployUrl}`),
          chalk.cyan(`Time: ${formatTime(duration)}`),
          chalk.cyan(`Date: ${new Date().toLocaleString()}`),
          chalk.cyan(`Status: ${isLive ? "Live" : "Pending"}`),
        ].join("\n");

        console.log(
          boxen(chalk.green("Deployment Details:\n") + deployInfo, {
            padding: 1,
            margin: 1,
            borderStyle: "double",
            borderColor: "cyan",
          })
        );

        const { openPreview } = await inquirer.prompt([
          {
            type: "confirm",
            name: "openPreview",
            message: "Would you like to open the deployed page?",
            default: true,
          },
        ]);

        if (openPreview) {
          spinner.start("Opening preview...");
          await open(deployUrl);
          spinner.succeed("Preview opened!");
        }

        config.lastDeployed = {
          url: deployUrl,
          time: duration,
          date: new Date().toISOString(),
          status: isLive ? "live" : "pending",
        };
        saveConfig(config);
      } catch (error) {
        spinner.fail("Deployment failed");
        console.error(chalk.red(`Error: ${error.message}`));
        console.error(
          chalk.red(
            "Please ensure you have push access and the repository is properly configured"
          )
        );
      }
    } catch (error) {
      console.error(chalk.red("✗ Error:", error.message));
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  showBanner();
  program.outputHelp((txt) => chalk.yellow(txt));
}
