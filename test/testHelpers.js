const {
  promises: { readFile },
} = require("fs");
const { XMLParser } = require("fast-xml-parser");

const FIXTURE_DIR = "test/fixtures";

const readFixture = (relPath) => {
  return readFile(`${FIXTURE_DIR}/${relPath}`).then((fileBuffer) =>
    fileBuffer.toString()
  );
};

const xmlFixture = async (relPath) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });
  const content = await readFixture(relPath);

  return parser.parse(content);
};

module.exports.FIXTURE_DIR = FIXTURE_DIR;
module.exports.readFixture = readFixture;
module.exports.xmlFixture = xmlFixture;
