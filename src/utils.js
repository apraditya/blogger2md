const { existsSync } = require("fs");

const usage = "\nUsage: blogger2md <backup-xml> <output-dir>";

const validateArgs = (args) => {
  let [backupXml, outputDir = "md-output"] = args;

  if (!backupXml) {
    throw "Missing backup file";
  } else if (!existsSync(backupXml)) {
    throw `${backupXml} doesn't exist.`;
  }

  return {
    backupXml,
    outputDir,
  };
};

module.exports = {
  validateArgs,
};
