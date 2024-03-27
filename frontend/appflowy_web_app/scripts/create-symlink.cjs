const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const sourcePath = process.argv[2];
const targetPath = process.argv[3];

// ensure source and target paths are provided
if (!sourcePath || !targetPath) {
  console.error(chalk.red('source and target paths are required'));
  process.exit(1);
}

// ensure source path exists
if (!fs.existsSync(sourcePath)) {
  console.error(chalk.red(`source path does not exist: ${sourcePath}`));
  process.exit(1);
}

// ensure target path exists
if (!fs.existsSync(targetPath)) {
  console.error(chalk.red(`target path does not exist: ${targetPath}`));
  process.exit(1);
}

const fullSourcePath = path.resolve(sourcePath);
const fullTargetPath = path.resolve(targetPath);

if (fs.existsSync(fullTargetPath)) {
  // unlink existing symlink
  fs.unlinkSync(fullTargetPath);
}

// create symlink
fs.symlink(fullSourcePath, fullTargetPath, 'junction', (err) => {
  if (err) {
    console.error(chalk.red(`error creating symlink: ${err.message}`));
    process.exit(1);
  }
  console.log(chalk.green(`symlink created: `) + chalk.blue(`${fullSourcePath}`) + ' -> ' + chalk.blue(`${fullTargetPath}`));

});
