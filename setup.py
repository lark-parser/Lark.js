# -*- coding: utf-8 -*-
from setuptools import setup

packages = \
['larkjs']

package_data = \
{'': ['*']}

install_requires = \
['lark>=1.0.0,<2.0.0']

entry_points = \
{'console_scripts': ['lark-js = larkjs.__main__:main']}

setup_kwargs = {
    'name': 'lark-js',
    'version': '0.1.1',
    'description': 'An extension to Lark that generates a Javascript standalone',
    'long_description': '# Lark.js\n\n**Generate LALR(1) parsers in Javascript**\n\nLark is a popular parsing toolkit for Python.\n\nThis project is a live port of the Lark standalone parser to Javascript.\n\n**Lark.js** takes a `.lark` grammar, and from it generates a standalone Javascript parser.\n\nThe LALR(1) algorithm guarantees O(n) running time (proportional to input length), and minimal memory consumption.\n\n### Lark grammars\n\nLark grammars are written in an augmented EBNF (a textual format), and usually use the `.lark` extension.\n\nBecause they are purely declarative, and don\'t contain code, they are entirely portable between languages.\n\nIt is now possible to use Lark grammars in 3 languages: Python, Javascript, and Julia.\n\n#### "Hello World" Grammar\n\nThe following Lark grammar will match the string "Hello, World!" --\n\n```lark\n// A bunch of words\nstart: word+                \n\n// Allow optional punctuation after each word\nword: WORD ["," | "!"]\n\n// imports WORD from library\n%import common.WORD   \n\n// Disregard spaces in text\n%ignore " "           \n```\n\n### Quick links\n\n- [Documentation](https://lark-parser.github.io/Lark.js/index.html)\n- [Examples](https://github.com/lark-parser/Lark.js/tree/master/examples)\n- [Online IDE](https://lark-parser.github.io/ide)\n- [Gitter chat](https://gitter.im/lark-parser/Lobby) - A place to ask questions and discuss\n- [Lark](https://github.com/lark-parser/lark) - The Python library\n\n### Install Lark.js\n\nInstall lark-js on Python:\n\n```sh\n    pip install lark-js --upgrade\n```\n\n### Generate a Javascript LALR(1) parser\n\n```sh\n\tlark-js my_grammar.lark -o my_parser.js\n```\n\nFor help, run:\n\n```sh\n\tlark-js --help\n```\n\n## Features\n\n - **LALR(1)** parser - Fast and light\n - **EBNF** grammar\n - Builds a parse-tree (AST) automagically, based on the structure of the grammar\n - Usable in the browser and in Node.js\n - Interactive parsing (step-by-step)\n - Error handling\n - Tree utilities (including transformers & visitors)\n - Line & column tracking\n - Standard library of terminals (strings, numbers, names, etc.)\n - Import grammars from Nearley.js\n\n Planned features:\n\n - Support for Earley\n\n### Syntax Highlighting\n\nLark provides syntax highlighting for its grammar files (\\*.lark):\n\n- [Sublime Text & TextMate](https://github.com/lark-parser/lark_syntax)\n- [vscode](https://github.com/lark-parser/vscode-lark)\n- [Intellij & PyCharm](https://github.com/lark-parser/intellij-syntax-highlighting)\n- [Vim](https://github.com/lark-parser/vim-lark-syntax)\n- [Atom](https://github.com/Alhadis/language-grammars)\n\n### Live Port\n\nUsually, ports from one language to another are at risk of falling out of sync as time goes on.\n\nBut Lark.js wasn\'t translated by hand -- 98% of the lines were transpiled directly from Lark\'s Python code!\n\nThat means that futures updates to Lark-Python (fixes, features, etc.) will automatically sync to Lark.js.\n\n## License\n\nLark.js uses the [MIT license](LICENSE).\n\n## Contribute\n\nLark.js is accepting pull-requests. If you would like to help, open an issue or find us on gitter.\n\n## Sponsoring\n\nLark.js was made possible with the help of a generous donation by [Smore](https://www.smore.com/) ❤️\n\nIf you like Lark, and want to see it grow, please consider [sponsoring us!](https://github.com/sponsors/lark-parser)\n',
    'author': 'Erez Shin',
    'author_email': 'erezshin@gmail.com',
    'maintainer': None,
    'maintainer_email': None,
    'url': 'https://github.com/lark-parser/lark.js',
    'packages': packages,
    'package_data': package_data,
    'install_requires': install_requires,
    'entry_points': entry_points,
}


setup(**setup_kwargs)
