import { it, expect, describe } from "vitest";

import { parseXml } from "../src/blogger";
import { FIXTURE_DIR } from "./testHelpers";

describe("parseXml", () => {
  it("parses the xml", async () => {
    const xmlFile = `${FIXTURE_DIR}/complete.xml`;
    const result = parseXml(xmlFile);
    await expect(result).resolves.toEqual(1);
  });
});
