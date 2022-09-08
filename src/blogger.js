const {
  promises: { readFile },
} = require("fs");
const { XMLParser } = require("fast-xml-parser");

async function parseXml(xmlFile) {
  return readFile(xmlFile).then((fileBuffer) => {
    const parser = new XMLParser();
    const parsedXml = parser.parse(fileBuffer.toString());
    const { title, author, entry, updated } = parsedXml.feed;

    return { title, author, entry, updated };
  });
}

module.exports.parseXml = parseXml;
