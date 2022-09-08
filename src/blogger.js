const {
  promises: { readFile },
} = require("fs");

async function parseXml(xmlFile) {
  return readFile(xmlFile).then(() => 1);
}

module.exports.parseXml = parseXml;
