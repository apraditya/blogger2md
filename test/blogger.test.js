import { it, expect, describe } from "vitest";

import { parseXml } from "../src/blogger";
import { FIXTURE_DIR } from "./testHelpers";

describe("parseXml", () => {
  it("parses the xml", async () => {
    const xmlFile = `${FIXTURE_DIR}/complete.xml`;
    const result = await parseXml(xmlFile);
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("author.email", "noreply@blogger.com");
    expect(result).toHaveProperty("entry");
    expect(result).toHaveProperty("updated");
  });

  it("throws an error when the xml file isn't valid", () => {
    const xmlFile = `${FIXTURE_DIR}/complete-entry.xml`;
    expect(() => await parseXml(xmlFile)).toThrowError('invalid')
  });
});
