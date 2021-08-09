# Lark.js - a port of the Lark parsing toolkit to Javascript

Lark is a parsing toolkit for Python, built with a focus on ergonomics, performance and modularity.

With Lark.js, you create a fast Javascript parser from a grammar written for Lark.

The compiled Javascript modules include Lark's base classes and utilities, such as `Tree`, `Transformer`, and `InteractiveParser`.

Currently, only LALR(1) is supported. (Earley support is planned!)

### Quick links

- [Lark (Python)](https://https://github.com/lark-parser/lark)
- [Cheatsheet (PDF)](/docs/_static/lark_cheatsheet.pdf)
- [Online IDE](https://lark-parser.github.io/ide)
- [Gitter chat](https://gitter.im/lark-parser/Lobby)

### Install Lark.js

    $ pip install lark-js --upgrade

[![Build Status](https://travis-ci.org/lark-parser/lark.svg?branch=master)](https://travis-ci.org/lark-parser/lark)

### Generate a Javascript LALR(1) parser

```bash
	python -m lark-js my_grammar.lark -o my_parser.js
```

For help, run:

```bash
	python -m lark-js --help
```

### Syntax Highlighting

Lark provides syntax highlighting for its grammar files (\*.lark):

- [Sublime Text & TextMate](https://github.com/lark-parser/lark_syntax)
- [vscode](https://github.com/lark-parser/vscode-lark)
- [Intellij & PyCharm](https://github.com/lark-parser/intellij-syntax-highlighting)
- [Vim](https://github.com/lark-parser/vim-lark-syntax)
- [Atom](https://github.com/Alhadis/language-grammars)


## List of main features

 - Builds a parse-tree (AST) automagically, based on the structure of the grammar
 - **LALR(1)** parser - Fast and light
 - **EBNF** grammar
 - Usable in the browser and in Node
 - Automatic line & column tracking
 - Standard library of terminals (strings, numbers, names, etc.)
 - Import grammars from Nearley.js ([read more](/docs/tools.md#importing-grammars-from-nearleyjs))
 - And much more!

## License

Lark.js uses the [MIT license](LICENSE).

## Contribute

Lark.js is accepting pull-requests. If you would like to help, open an issue or find us on gitter.

## Sponsoring

Lark.js was made possible with the help of a generous donation by [Smore](https://www.smore.com/) ❤️

If you like Lark, and want to see it grow, please consider [sponsoring us!](https://github.com/sponsors/lark-parser)
