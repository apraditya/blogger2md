import { afterEach, it, expect, describe } from "vitest";
import { existsSync, rmdirSync } from "fs";

import { validateArgs } from "../src/utils";

describe("validateArgs", () => {
  let testedArgs = [];

  afterEach(() => {
    const output = "md-output";
    if (existsSync(output)) {
      rmdirSync(output);
    }
  });

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

  it("creates the output dir if not exist", () => {
    testedArgs = ["./test/fixtures/complete.xml"];
    expect(existsSync("md-output")).toBeFalsy();
    const { backupXml, outputDir } = subject();
    expect(existsSync("md-output")).toBeTruthy();
  });
});
