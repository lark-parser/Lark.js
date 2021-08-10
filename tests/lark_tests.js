
const lark = require('../larkjs/lark.js')
const {
  Tree, Token,
  Visitor, Visitor_Recursive, Transformer, Interpreter, visit_children_decor, v_args, Discard, Transformer_InPlace,
  Transformer_InPlaceRecursive, Transformer_NonRecursive
} = lark


_ = require('lodash')

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0)
}


//
//   Implementation of Scanner + Regular expression polyfill
// ----------------------------------------------------------

const re = {
  escape(string) {
    // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  },
  compile(regex, flags) {
    // May throw re.error
    return new RegExp(regex, flags);
  },
  error: SyntaxError,
};

function _get_match(re_, regexp, s, flags) {
  const m = re_.compile(regexp, flags).exec(s);
  if (m != null) return m[0];
}

class Scanner {
  constructor(terminals, g_regex_flags, re_, use_bytes, match_whole = false) {
    this.terminals = terminals;
    this.g_regex_flags = g_regex_flags;
    this.re_ = re_;
    this.use_bytes = use_bytes;
    this.match_whole = match_whole;
    this.allowed_types = new Set(this.terminals.map((t) => t.name));

    this._regexps = this._build_mres(terminals);
  }

  _build_mres(terminals) {
    // TODO deal with priorities!
    let postfix = this.match_whole ? "$" : "";
    let patterns_by_flags = segment_by_key(terminals, (t) =>
      t.pattern.flags.join("")
    );

    let regexps = [];
    for (let [flags, patterns] of patterns_by_flags) {
      const pattern = patterns
        .map((t) => `(?<${t.name}>${t.pattern.to_regexp() + postfix})`)
        .join("|");
      regexps.push(new RegExp(pattern, this.g_regex_flags + flags + "y"));
    }

    return regexps;
  }

  match(text, pos) {
    for (const re of this._regexps) {
      re.lastIndex = pos;
      let m = re.exec(text);
      if (m) {
        // Find group. Ugly hack, but javascript is forcing my hand.
        let group = null;
        for (let [k, v] of Object.entries(m.groups)) {
          if (v) {
            group = k;
            break;
          }
        }
        return [m[0], group];
      }
    }
  }
} //
//  Start of library code
// --------------------------

const util = typeof require !== "undefined" && require("util");

class ABC {}

const NotImplemented = {};

function dict_items(d) {
  return Object.entries(d);
}
function dict_keys(d) {
  return Object.keys(d);
}
function dict_values(d) {
  return Object.values(d);
}

function dict_pop(d, key) {
  let value = d[key];
  delete d[key];
  return value;
}

function dict_get(d, key, otherwise = null) {
  return d[key] || otherwise;
}

function dict_update(self, other) {
  if (self.constructor.name === "Map") {
    for (const [k, v] of dict_items(other)) {
      self.set(k, v);
    }
  } else {
    for (const [k, v] of dict_items(other)) {
      self[k] = v;
    }
  }
}

function make_constructor(cls) {
  return function () {
    return new cls(...arguments);
  };
}

function range(start, end) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  res = [];
  for (let i = start; i < end; i++) res.push(i);
  return res;
}

function format(s) {
  let counter = 0;
  let args = [...arguments].slice(1);

  return s.replace(/%([sr])/g, function () {
    const t = arguments[1];
    const item = args[counter++];
    if (t === "r") {
      return util
        ? util.inspect(item, false, null, true)
        : JSON.stringify(item, null, 0);
    } else {
      return item;
    }
  });
}

function union(setA, setB) {
  let _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

function intersection(setA, setB) {
  let _intersection = new Set();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

function dict(d) {
  return { ...d };
}

function bool(x) {
  return !!x;
}

function new_object(cls) {
  return Object.create(cls.prototype);
}

function copy(obj) {
  if (typeof obj == "object") {
    let empty_clone = Object.create(Object.getPrototypeOf(obj));
    return Object.assign(empty_clone, obj);
  }
  return obj;
}

function map_pop(key) {
  let value = this.get(key);
  this.delete(key);
  return value;
}

function hash(x) {
  return x;
}
function tuple(x) {
  return x;
}
function frozenset(x) {
  return new Set(x);
}

function is_dict(x) {
  return x && x.constructor.name === "Object";
}
function is_array(x) {
  return x && x.constructor.name === "Array";
}
function callable(x) {
  return typeof x === "function";
}

function* enumerate(it, start = 0) {
  // Taken from: https://stackoverflow.com/questions/34336960/what-is-the-es6-equivalent-of-python-enumerate-for-a-sequence
  let i = start;
  for (const x of it) {
    yield [i++, x];
  }
}

function any(lst) {
  for (const item of lst) {
    if (item) {
      return true;
    }
  }
  return false;
}

function all(lst) {
  for (const item of lst) {
    if (!item) {
      return false;
    }
  }
  return true;
}

function filter(pred, lst) {
  return lst.filter(pred || bool);
}

function partial(f) {
  let args = [...arguments].slice(1);
  return function () {
    return f(...args, ...arguments);
  };
}

class EOFError extends Error {}

function last_item(a) {
  return a[a.length - 1];
}

function callable_class(cls) {
  return function () {
    let inst = new cls(...arguments);
    return inst.__call__.bind(inst);
  };
}

function list_repeat(list, count) {
  return Array.from({ length: count }, () => list).flat();
}

function isupper(a) {
  return /^[A-Z]*$/.test(a);
}

function rsplit(s, delimiter, limit) {
  const arr = s.split(delimiter);
  return limit ? arr.splice(-limit - 1) : arr;
}

function str_count(s, substr) {
  let re = new RegExp(substr, "g");
  return (s.match(re) || []).length;
}

function isSubset(subset, set) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

function* segment_by_key(a, key) {
  let buffer = [];
  let last_k = null;
  for (const item of a) {
    const k = key(item);
    if (last_k && k != last_k) {
      yield [last_k, buffer];
      buffer = [];
    }
    buffer.push(item);
    last_k = k;
  }
  yield [last_k, buffer];
}

// --------------------------
//  End of library code
//

//
// Test Trees
//


class TestCase {
  assertEqual(a, b) {
    console.assert(_.isEqual(a, b), 'Not equal:', a, b)
  }

}

zip = _.zip

class TestTrees extends TestCase {
  setUp() {
    this.tree1 = new Tree(
      "a",
      zip([..."bcd"], [..."xyz"]).map(([x, y]) => new Tree(x, [y]))
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
        throw new Discard();
      }
    }

    let t = new Tree("root", [
      new Tree("b", []),
      new Tree("a", []),
      new Tree("b", []),
      new Tree("c", []),
      new Tree("b", []),
    ]);
    const tn = new Tree("c", [])
    let t2 = new Tree("root", [1, tn]);
    tn.meta, t2.meta   // create meta nodes for isEqual (to match those created by the transformer)

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
          return sum(children);
        }

        N(token) {
          return parseInt(token.value);
        }
      }

      copied = _.cloneDeep(tree);
      result = new T().transform(copied);
      const t = new Tree("start", [3, 7])
      t.meta  // create meta for isEqual
      this.assertEqual(result, t);
    }
  }
}

module.exports = { TestTrees };


function run_test_class(cls) {

  test = new cls()
  test.setUp()
  for (const name of Object.getOwnPropertyNames(cls.prototype).filter(prop => prop.startsWith("test_"))) {
    console.log("Test:", name)
    test[name]()
  }
}


run_test_class(TestTrees)