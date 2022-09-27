import { it, expect, describe } from "vitest";
import { FIXTURE_DIR, xmlFixture } from "./testHelpers";

import {
  entryToPost,
  filenameFromTitle,
  parseXml,
  postToMd,
} from "../src/blogger";

describe("parseXml", () => {
  it("parses the xml", async () => {
    const xmlFile = `${FIXTURE_DIR}/complete.xml`;
    const result = await parseXml(xmlFile);
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("author.email", "noreply@blogger.com");
    expect(result).toHaveProperty("entry");
    expect(result).toHaveProperty("updated");
  });

  it("throws an error when the xml file isn't valid", async () => {
    const xmlFile = `${FIXTURE_DIR}/complete-entry.xml`;
    await expect(parseXml(xmlFile)).rejects.toThrowError("invalid");
  });
});

describe("entryToPost", () => {
  let xmlFile = "post-normal.xml";

  const subject = async () => {
    const content = await xmlFixture(xmlFile);
    return entryToPost(content.entry);
  };

  it("returns post object", async () => {
    const result = await subject();
    expect(result).toHaveProperty("title");
    expect(result.title).toContain("git-flow Auto Komplit");
    expect(result).toHaveProperty("draft", "false");
    expect(result).toHaveProperty("published");
    expect(result.published).toContain("2015-12-");
    expect(result).toHaveProperty("url");
    expect(result.url).toContain("plugin-git-flow-auto-komplit");
    expect(result).toHaveProperty("tags");
    expect(result.tags).toContain("Tools", "Mac", "Git");
    expect(result).toHaveProperty("content");
  });

  it("identifies if the post is on draft", async () => {
    xmlFile = "post-draft.xml";
    const result = await subject();
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("draft", "true");
    expect(result).toHaveProperty("published");
    expect(result).toHaveProperty("url");
    expect(result).toHaveProperty("tags", []);
    expect(result).toHaveProperty("content");
  });
});

describe("postToMd", () => {
  let xmlFile = "post-normal.xml";

  const subject = async () => {
    const xmlContent = await xmlFixture(xmlFile);
    const post = entryToPost(xmlContent.entry);
    return postToMd(post);
  };

  const getFrontMatter = (mdStr) => {
    const fmLines = [];
    const mdLines = mdStr.split("\n");
    let index = 1;
    let currentLine = mdLines[index];
    while (currentLine !== "---") {
      fmLines.push(currentLine);
      index += 1;
      currentLine = mdLines[index];
    }

    return fmLines;
  };

  it("contains markdown front matter", async () => {
    const result = await subject();
    const fmLines = getFrontMatter(result);
    expect(fmLines[0]).toContain("title");
    expect(fmLines[0]).toContain("git-flow");
    expect(fmLines[1]).toContain("date");
    expect(fmLines[1]).toContain("2015-12");
    expect(fmLines[2]).toContain("draft");
    expect(fmLines[2]).toContain("false");
    expect(fmLines[3]).toContain("url");
    expect(fmLines[3]).toContain("git-flow-auto-komplit");
    expect(fmLines[4]).toContain("tags");
  });

  it("contains draft markdown front matter", async () => {
    xmlFile = "post-draft.xml";
    const result = await subject();
    const fmLines = getFrontMatter(result);
    expect(fmLines[0]).toContain("title");
    expect(fmLines[0]).toContain("undefined");
    expect(fmLines[1]).toContain("date");
    expect(fmLines[1]).toContain("2015-11");
    expect(fmLines[2]).toContain("draft");
    expect(fmLines[2]).toContain("true");
    expect(fmLines[3]).toContain("url");
    expect(fmLines[3]).toContain("");
    expect(fmLines[4]).toContain("tags");
  });

  it("handles if the tags is a single string", async () => {
    xmlFile = "post-single-tag.xml";
    const result = await subject();
    const fmLines = getFrontMatter(result);
    expect(fmLines[0]).toContain("title");
    expect(fmLines[4]).toContain("tags");
    expect(fmLines[5]).toContain("Ruby on Rails");
    expect(fmLines[6]).toBeUndefined();
  });
});

describe("filenameFromTitle", () => {
  it("strips dot and single quote", () => {
    const result = filenameFromTitle("'Magic' conversion *.html to text");
    expect(result).toEqual("magic-conversion-html-to-text");
  });

  it("strips non number and alphabet character", () => {
    const result = filenameFromTitle("Reduce File Size by 30% (aproximately)");
    expect(result).toEqual("reduce-file-size-by-30-aproximately");
  });
});
