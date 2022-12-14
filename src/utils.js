const {
  existsSync,
  mkdirSync,
  promises: { writeFile },
} = require("fs");

const validateArgs = (args) => {
  const [backupXml, outputDir = "md-output"] = args;

  if (!backupXml) {
    throw new Error("Missing backup file");
  } else if (!existsSync(backupXml)) {
    throw new Error(`${backupXml} doesn't exist.`);
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
