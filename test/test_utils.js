const _ = require("lodash");
const lark = require("../larkjs/lark.js");
const assert = require('assert');

const {
  isupper,
} = lark;

class TestCase {
  assertEqual(a, b) {
    assert(_.isEqual(a, b), "Not equal:", a, b);
  }
}

class TestUtils extends TestCase {
  test_is_upper_ignore_0() {
    this.assertEqual(isupper('__IGNORE_0'), true);
  }

  test_is_upper_hello() {
    this.assertEqual(isupper('HELLO'), true);
  }

  test_is_upper_foo_bar() {
    this.assertEqual(isupper('FOO_BAR'), true);
  }

  test_is_upper_foo_bar_baz() {
    this.assertEqual(isupper('FOO-BAR BAZ'), true);
  }

  test_is_upper_hello_lowercase() {
    this.assertEqual(isupper('Hello'), false);
  }

  test_is_upper_hell_o_uppercase() {
    this.assertEqual(isupper('HellO'), false);
  }

  test_is_upper_single_digit() {
    this.assertEqual(isupper('0'), false);
  }

  test_is_upper_numbers() {
    this.assertEqual(isupper('123'), false);
  }
}

module.exports = { TestUtils };
