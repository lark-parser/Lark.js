// First, we must generate a Python parser using:
//
//      python -m lark-js \lark\examples\advanced\python3.lark -s file_input -o python_parser.js
//
// Then we can run it with
//
//      node run_python_parser.js

lark = require('./python_parser.js')

class PythonIndenter extends lark.Indenter {
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

const parser = lark.load_parser({postlex: new PythonIndenter()})


function test_python_lib() {
    const BASE_DIR = 'C:/Python38/lib/'

    const fs = require('fs');
    const files = fs.readdirSync(BASE_DIR);

    for (const fn of files) {
        if (fn.endsWith('.py')) {

            fs.readFile( BASE_DIR + fn, function (err, data) {
              if (err) {
                throw err;
              }
              const text = data.toString();

                console.log(fn, text.length)
                let tree = parser.parse(text+'\n', 'file_input')

            });

        }
    }
}


if (require && require.main === module) {
    test_python_lib()
}

