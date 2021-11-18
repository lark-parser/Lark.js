const _ = require("lodash");
const lark = require("../larkjs/lark.js");
const assert = require('assert');

const {
  Tree,
  Token,
  Visitor,
  Visitor_Recursive,
  Transformer,
  Interpreter,
  visit_children_decor,
  v_args,
  Discard,
  Transformer_InPlace,
  Transformer_InPlaceRecursive,
  Transformer_NonRecursive,
} = lark;

//
// Test Trees
//

class TestCase {
  assertEqual(a, b) {
    assert(_.isEqual(a, b), "Not equal:", a, b);
  }
}

class TestTrees extends TestCase {
  setUp() {
    this.tree1 = new Tree(
      "a",
      _.zip([..."bcd"], [..."xyz"]).map(([x, y]) => new Tree(x, [y]))
    );
  }

  test_iter_subtrees() {
    let expected = [
      new Tree("b", ["x"]),
      new Tree("c", ["y"]),
      new Tree("d", ["z"]),
      new Tree("a", [
        new Tree("b", ["x"]),
        new Tree("c", ["y"]),
        new Tree("d", ["z"]),
      ]),
    ];
    let nodes = Array.from(this.tree1.iter_subtrees());
    this.assertEqual(nodes, expected);
  }

  test_iter_subtrees_topdown() {
    let expected = [
      new Tree("a", [
        new Tree("b", ["x"]),
        new Tree("c", ["y"]),
        new Tree("d", ["z"]),
      ]),
      new Tree("b", ["x"]),
      new Tree("c", ["y"]),
      new Tree("d", ["z"]),
    ];
    let nodes = Array.from(this.tree1.iter_subtrees_topdown());
    this.assertEqual(nodes, expected);
    this.assertEqual(nodes, expected);
  }

  test_visitor() {
    class Visitor1 extends Visitor {
      constructor() {
        super();
        this.nodes = [];
      }

      __default__(tree) {
        this.nodes.push(tree);
      }
    }

    class Visitor1_Recursive extends Visitor_Recursive {
      constructor() {
        super();
        this.nodes = [];
      }

      __default__(tree) {
        this.nodes.push(tree);
      }
    }

    let visitor1 = new Visitor1();
    let visitor1_recursive = new Visitor1_Recursive();
    let expected_top_down = [
      new Tree("a", [
        new Tree("b", ["x"]),
        new Tree("c", ["y"]),
        new Tree("d", ["z"]),
      ]),
      new Tree("b", ["x"]),
      new Tree("c", ["y"]),
      new Tree("d", ["z"]),
    ];
    let expected_botton_up = [
      new Tree("b", ["x"]),
      new Tree("c", ["y"]),
      new Tree("d", ["z"]),
      new Tree("a", [
        new Tree("b", ["x"]),
        new Tree("c", ["y"]),
        new Tree("d", ["z"]),
      ]),
    ];
    visitor1.visit(this.tree1);
    this.assertEqual(visitor1.nodes, expected_botton_up);
    visitor1_recursive.visit(this.tree1);
    this.assertEqual(visitor1_recursive.nodes, expected_botton_up);
    visitor1.nodes = [];
    visitor1_recursive.nodes = [];
    visitor1.visit_topdown(this.tree1);
    this.assertEqual(visitor1.nodes, expected_top_down);
    visitor1_recursive.visit_topdown(this.tree1);
    this.assertEqual(visitor1_recursive.nodes, expected_top_down);
  }

  test_interp() {
    let t = new Tree("a", [new Tree("b", []), new Tree("c", []), "d"]);
    class Interp1 extends Interpreter {
      a(tree) {
        return [...this.visit_children(tree), "e"];
      }

      b(tree) {
        return "B";
      }

      c(tree) {
        return "C";
      }
    }

    this.assertEqual(new Interp1().visit(t), Array.from("BCde"));

    class Interp3 extends Interpreter {
      b(tree) {
        return "B";
      }

      c(tree) {
        return "C";
      }
    }

    this.assertEqual(new Interp3().visit(t), Array.from("BCd"));
  }

  test_discard() {
    class MyTransformer extends Transformer {
      a(args) {
        return 1;
      }

      // some code here

      b(args) {
        return Discard;
      }
    }

    let t = new Tree("root", [
      new Tree("b", []),
      new Tree("a", []),
      new Tree("b", []),
      new Tree("c", []),
      new Tree("b", []),
    ]);
    const tn = new Tree("c", []);
    let t2 = new Tree("root", [1, tn]);
    tn.meta, t2.meta; // create meta nodes for isEqual (to match those created by the transformer)

    let x = new MyTransformer().transform(t);
    this.assertEqual(x, t2);
  }

  test_transformer_variants() {
    let copied, result;
    let tree = new Tree("start", [
      new Tree("add", [new Token("N", "1"), new Token("N", "2")]),
      new Tree("add", [new Token("N", "3"), new Token("N", "4")]),
    ]);
    for (const base of [
      Transformer,
      Transformer_InPlace,
      Transformer_NonRecursive,
      Transformer_InPlaceRecursive,
    ]) {
      class T extends base {
        add(children) {
          return _.sum(children);
        }

        N(token) {
          return parseInt(token.value);
        }
      }

      copied = _.cloneDeep(tree);
      result = new T().transform(copied);
      const t = new Tree("start", [3, 7]);
      t.meta; // create meta for isEqual
      this.assertEqual(result, t);
    }
  }
}

module.exports = { TestTrees };
