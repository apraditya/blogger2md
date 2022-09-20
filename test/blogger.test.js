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
    const entry = await xmlFixture(xmlFile);
    return postToMd(entry);
  };

  it("returns post object", async () => {
    const result = await subject();
    expect(result).toHaveProperty("title");
    expect(result.title).toContain("git-flow Auto Komplit");
    expect(result).toHaveProperty("draft", "false");
    expect(result).toHaveProperty("published");
    expect(result.published).toContain("2015-12-");
  });

  it("identifies if the post is on draft", async () => {
    xmlFile = "post-draft.xml";
    const result = await subject();
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("draft", "true");
    expect(result).toHaveProperty("published");
  });
});
