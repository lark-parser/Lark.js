// 
//   Example Python Parser for Javascript
// ----------------------------------------
//
// First, we must generate a Python parser using:
//
//      lark-js python3.lark -s file_input -o python_parser.js
//
//  (The grammar file can be found in the Lark repo:
//   https://github.com/lark-parser/lark/blob/master/examples/advanced/python3.lark)
//
// Then we can run it with
//
//      node run_python_parser.js
//

var {get_parser, Indenter} = require('./python_parser.js')

class PythonIndenter extends Indenter {
    constructor() {
        super()
        this.NL_type = '_NEWLINE'
        this.OPEN_PAREN_types = ['LPAR', 'LSQB', 'LBRACE']
        this.CLOSE_PAREN_types = ['RPAR', 'RSQB', 'RBRACE']
        this.INDENT_type = '_INDENT'
        this.DEDENT_type = '_DEDENT'
        this.tab_len = 8
    }
}

const parser = get_parser({postlex: new PythonIndenter()})


function test_python_lib(base_dir) {
    const fs = require('fs');
    const files = fs.readdirSync(base_dir);

    console.time('python_lib')
    for (const fn of files) {
        if (fn.endsWith('.py')) {
            const data = fs.readFileSync(base_dir + fn)
            const text = data.toString();

            console.log(fn, text.length)
            let tree = parser.parse(text+'\n', 'file_input')
        }
    }
    console.timeEnd('python_lib')
}


if (require && require.main === module) {
    test_python_lib('/Python38/lib/')   /* <-- Edit this */
}

