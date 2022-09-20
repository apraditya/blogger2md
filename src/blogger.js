const {
  promises: { readFile },
} = require("fs");
const { XMLParser } = require("fast-xml-parser");

async function parseXml(xmlFile) {
  return readFile(xmlFile).then((fileBuffer) => {
    const parser = new XMLParser();
    const parsedXml = parser.parse(fileBuffer.toString());
    const { title, author, entry, updated } = parsedXml.feed || {};

    if ([title, author, entry, updated].some((attr) => attr === undefined)) {
      throw "The XML file is invalid backup file.";
    }

    return { title, author, entry, updated };
  });
}

const postToMd = (postEntry) => {
  let { title, published } = postEntry;
  let draft = "false";

  return {
    title,
    draft,
    published,
  };
};

module.exports.postToMd = postToMd;
module.exports.parseXml = parseXml;
