const {
  promises: { readFile },
} = require("fs");
const { XMLParser } = require("fast-xml-parser");

async function parseXml(xmlFile) {
  return readFile(xmlFile).then((fileBuffer) => {
    const parser = new XMLParser({
      ignoreAttributes: false,
    });
    const parsedXml = parser.parse(fileBuffer.toString());
    const { title, author, entry, updated } = parsedXml.feed || {};

    if ([title, author, entry, updated].some((attr) => attr === undefined)) {
      throw "The XML file is invalid backup file.";
    }

    return { title, author, entry, updated };
  });
}

const getUrl = (entryLink) => {
  const altLink = entryLink.find(
    (link) => link["@_rel"] === "alternate" && link["@_type"] === "text/html"
  );

  if (altLink?.["@_href"]) {
    return altLink?.["@_href"];
  }

  return "";
};

const getTags = (entryCategory) => {
  if (!entryCategory.filter) {
    if (entryCategory["@_term"]?.indexOf("schemas.google") == -1) {
      return entryCategory["@_term"];
    } else {
      return [];
    }
  }

  return entryCategory
    .filter((category) => category["@_term"]?.indexOf("schemas.google") == -1)
    .map((category) => category["@_term"]);
};

const postToMd = (postEntry) => {
  let { published } = postEntry;
  let title = postEntry.title["#text"];
  let draft = "false";
  if (
    postEntry["app:control"] &&
    postEntry["app:control"]["app:draft"] == "yes"
  ) {
    draft = "true";
  }

  return {
    title,
    draft,
    published,
    url: getUrl(postEntry.link),
    tags: getTags(postEntry.category),
  };
};

module.exports.postToMd = postToMd;
module.exports.parseXml = parseXml;
