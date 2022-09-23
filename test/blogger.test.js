import { it, expect, describe } from "vitest";
import { FIXTURE_DIR, xmlFixture } from "./testHelpers";

import { parseXml, postToMd } from "../src/blogger";

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

describe("postToMd", () => {
  let xmlFile = "post-normal.xml";

  const subject = async () => {
    const content = await xmlFixture(xmlFile);
    return postToMd(content.entry);
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
  });

  it("identifies if the post is on draft", async () => {
    xmlFile = "post-draft.xml";
    const result = await subject();
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("draft", "true");
    expect(result).toHaveProperty("published");
    expect(result).toHaveProperty("url");
    expect(result).toHaveProperty("tags", []);
  });
});
