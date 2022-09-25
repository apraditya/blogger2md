const {
  promises: { readFile },
} = require("fs");
const { XMLParser } = require("fast-xml-parser");
const TurndownService = require("turndown");
const sanitize = require("sanitize-filename");

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

const entryToPost = (postEntry) => {
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
    content: postEntry.content["#text"],
  };
};

const postToMd = (post) => {
  const { url, tags } = post;

  let alias = url.replace(/^.*\/\/[^\/]+/, "");

  let tagStr = "";
  if (tags.length) {
    tagStr = tags.map((a) => "- " + a).join("\n");
  }

  const fileHeader = `---\ntitle: '${post.title}'\ndate: ${post.published}\ndraft: ${post.draft}\nurl: ${alias}\ntags: \n${tagStr}\n---\n`;

  const tds = new TurndownService({ codeBlockStyle: "fenced" });
  tds.addRule("preblock", {
    filter: ["pre"],
    replacement: (content) => "```\n" + content + "\n```",
  });

  const markdown = tds.turndown(post?.content || "");

  return `${fileHeader}\n${markdown}`;
};

const filenameFromTitle = (str) =>
  sanitize(str)
    .replace(/[\.']/g, "") // remove dots and single quotes
    .replace(/[^a-z0-9]/gi, "-") // replace those that aren't number nor letter with a hyphen
    .replace(/[\-]{2,}/g, "-") // replace repeating hyphens into a single one
    .replace(/-$/g, "") // remove trailing hyphen
    .toLowerCase();

module.exports.entryToPost = entryToPost;
module.exports.filenameFromTitle = filenameFromTitle;
module.exports.parseXml = parseXml;
module.exports.postToMd = postToMd;
