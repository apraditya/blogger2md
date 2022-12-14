const {
  promises: { readFile },
} = require("fs");
const { XMLParser } = require("fast-xml-parser");
const TurndownService = require("turndown");
const sanitize = require("sanitize-filename");

const { saveToFile } = require("./utils");

async function parseXml(xmlFile) {
  return readFile(xmlFile).then((fileBuffer) => {
    const parser = new XMLParser({
      ignoreAttributes: false,
    });
    const parsedXml = parser.parse(fileBuffer.toString());
    const { title, author, entry, updated } = parsedXml.feed || {};

    if ([title, author, entry, updated].some((attr) => attr === undefined)) {
      throw new Error("The XML file is invalid backup file.");
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
    if (entryCategory["@_term"]?.indexOf("schemas.google") === -1) {
      return entryCategory["@_term"];
    } else {
      return [];
    }
  }

  return entryCategory
    .filter((category) => category["@_term"]?.indexOf("schemas.google") === -1)
    .map((category) => category["@_term"]);
};

const entryToPost = (postEntry) => {
  const { published } = postEntry;
  const title = postEntry.title["#text"];
  let draft = "false";
  if (
    postEntry["app:control"] &&
    postEntry["app:control"]["app:draft"] === "yes"
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

  const alias = url.replace(/^.*\/\/[^/]+/, "");

  let tagStr = "";
  if (tags.length) {
    if (tags.map) {
      tagStr = tags.map((a) => `- ${a}`).join("\n");
    } else {
      tagStr = `- ${tags}`;
    }
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
    .replace(/[.']/g, "") // remove dots and single quotes
    .replace(/[^a-z0-9]/gi, "-") // replace those that aren't number nor letter with a hyphen
    .replace(/[-]{2,}/g, "-") // replace repeating hyphens into a single one
    .replace(/-$/g, "") // remove trailing hyphen
    .toLowerCase();

const savePost = (post, folder = ".") =>
  new Promise((resolve, reject) => {
    try {
      const filename = `${folder}/${filenameFromTitle(post.title)}.md`;
      resolve(saveToFile(filename, postToMd(post)));
    } catch (error) {
      reject(error);
    }
  });

const importXml = async (backupXml, outputDir) => {
  const parsedXml = await parseXml(backupXml);
  Object.values(parsedXml.entry).forEach((entry) => {
    if (entry.id.indexOf(".post-") !== -1 && !entry["thr:in-reply-to"]) {
      const post = entryToPost(entry);
      if (!post.title) {
        console.log(`Skipped ${entry.id} since it has no title`);
      } else {
        savePost(post, outputDir).catch((error) => {
          const postSubject = post.title || `entry ID: ${entry.id}`;
          console.error(error);
          console.error(`  "${postSubject}" is skipped due to this error`);
        });
      }
    }
  });
};

module.exports = {
  entryToPost,
  filenameFromTitle,
  importXml,
  parseXml,
  postToMd,
};
