#! /usr/bin/env node

const utils = require("../src/utils");

const usage = "\nUsage: blogger2md <backup-xml> <output-dir>";

try {
  const { backupXml, outputDir } = utils.validateArgs(process.argv.slice(2));
} catch (error) {
  console.error(`Error: ${error}`);
  return 1;
}
