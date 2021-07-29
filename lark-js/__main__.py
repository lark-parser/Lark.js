#
#
#   Lark.js Generator Tool
# ----------------------------
# Generates a stand-alone LALR(1) parser for Javascript.
#
# Git:    https://github.com/erezsh/lark.js
# Author: Erez Shinan (erezshin@gmail.com)
#
#

import json
import sys
from logging import DEBUG, INFO, WARN, ERROR
from argparse import ArgumentParser, FileType
from pathlib import Path

from lark import Lark
from lark.lexer import TerminalDef
from lark.grammar import Rule
from lark import Lark, logger

__dir__ = Path(__file__).parent

flags = [
    ('d', 'debug'),
    'keep_all_tokens',
    'regex',
    'propagate_positions',
    'maybe_placeholders',
    'use_bytes'
]

options = ['start', 'lexer']

lalr_argparser = ArgumentParser(add_help=False, epilog='Look at the Lark documentation for more info on the options')
lalr_argparser.add_argument('-v', '--verbose', action='count', default=0, help="Increase Logger output level, up to three times")
lalr_argparser.add_argument('-s', '--start', action='append', default=[])
lalr_argparser.add_argument('-l', '--lexer', default='contextual', choices=('standard', 'contextual'))
k = {'encoding': 'utf-8'}
lalr_argparser.add_argument('-o', '--out', type=FileType('w', **k), default=sys.stdout, help='the output file (default=stdout)')
lalr_argparser.add_argument('grammar_file', type=FileType('r', **k), help='A valid .lark file')

for f in flags:
    if isinstance(f, tuple):
        options.append(f[1])
        lalr_argparser.add_argument('-' + f[0], '--' + f[1], action='store_true')
    else:
        options.append(f)
        lalr_argparser.add_argument('--' + f, action='store_true')


def build_lalr(namespace):
    logger.setLevel((ERROR, WARN, INFO, DEBUG)[min(namespace.verbose, 3)])
    if len(namespace.start) == 0:
        namespace.start.append('start')
    kwargs = {n: getattr(namespace, n) for n in options}
    return Lark(namespace.grammar_file, parser='lalr', **kwargs), namespace.out



def main():
    parser = ArgumentParser(prog="prog='python -m lark-js'", description="Lark Stand-alone Generator Tool",
                            parents=[lalr_argparser], epilog='Look at the Lark documentation for more info on the options')
    # parser.add_argument('-c', '--compress', action='store_true', default=0, help="Enable compression")
    if len(sys.argv)==1:
        parser.print_help(sys.stderr)
        sys.exit(1)
    ns = parser.parse_args()

    lark_inst, out = build_lalr(ns)

    data, memo = lark_inst.memo_serialize([TerminalDef, Rule])
    data_json = json.dumps(data, indent=2)
    memo_json = json.dumps(memo, indent=2)

    with open(__dir__ / 'lark.js') as lark_js:
        output = lark_js.read()
        output += '\nvar DATA=%s;\n' % data_json
        output += '\nvar MEMO=%s;\n' % memo_json

    out.write(output)



if __name__ == '__main__':
    main()