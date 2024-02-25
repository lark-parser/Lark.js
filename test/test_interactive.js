const _ = require("lodash");
const lark = require("../larkjs/lark.js");
const assert = require('assert');

const {
  InteractiveParser,
} = lark;

//
// Test Interactive
//

class TestCase {
  assertOk(a) {
    assert(!!a); // assert that the value is truthy
  }
}

class TestInteractive extends TestCase {
  test_it_parses_interactively() {
    const mockParser = {};
    const mockParserState = {
      position: 30,
      parse_conf: {
        parse_table: {
          states: {
            30: {

              "ESCAPED_STRING": [
                {
                  "name": "Shift"
                },
                8
              ],
              "string": [
                {
                  "name": "Shift"
                },
                7
              ],
            },
          }
        }
      }};
    const mockLexerThread = {};
    const interactiveParser = new InteractiveParser(mockParser, mockParserState, mockLexerThread);
    this.assertOk(interactiveParser.accepts());
  }
}

module.exports = { TestInteractive };

