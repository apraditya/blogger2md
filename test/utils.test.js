import { it, expect, describe } from "vitest";

import { validateArgs } from "../src/utils";

describe("validateArgs", () => {
  let testedArgs = [];

  const subject = () => validateArgs(testedArgs);

  it("throws 'missing backup file' error", () => {
    expect(subject).toThrowError(/missing backup/i);
  });

  it("throws 'does not exist' error", () => {
    testedArgs = ["./not-exist-file.xml"];
    expect(subject).toThrowError(/doesn\'t exist/);
  });

  it("sets md-output as default outputDir", () => {
    testedArgs = ["./test/fixtures/complete.xml"];
    const { backupXml, outputDir } = subject();
    expect(backupXml).toEqual("./test/fixtures/complete.xml");
    expect(outputDir).toEqual("md-output");
  });
});
