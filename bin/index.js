#! /usr/bin/env node

const { importXml } = require("../src/blogger");
const utils = require("../src/utils");

const usage = "\nUsage: blogger2md <backup-xml> <output-dir>";

try {
  const { backupXml, outputDir } = utils.validateArgs(process.argv.slice(2));
  importXml(backupXml, outputDir);
} catch (error) {
  console.error(`Error: ${error}`);
  console.log(usage);
  return 1;
}
