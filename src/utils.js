const {
  existsSync,
  mkdirSync,
  promises: { writeFile },
} = require("fs");

const usage = "\nUsage: blogger2md <backup-xml> <output-dir>";

const validateArgs = (args) => {
  let [backupXml, outputDir = "md-output"] = args;

  if (!backupXml) {
    throw "Missing backup file";
  } else if (!existsSync(backupXml)) {
    throw `${backupXml} doesn't exist.`;
  }

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  return {
    backupXml,
    outputDir,
  };
};

const saveToFile = (filename, content) =>
  writeFile(filename, content)
    .then(() => {
      console.log(`Successfully saved to ${filename}`);
    })
    .catch((err) => {
      const message = `Error saving to ${filename} - ${JSON.stringify(err)}`;
      console.log(message);
      console.dir(err);
      throw new Error(message);
    });

module.exports = {
  saveToFile,
  validateArgs,
};
