// 
//   Example Python Parser for Javascript
// ----------------------------------------
//
// First, we must generate a Python 3 parser using:
//
//      lark-js python.lark -s file_input -o python_parser.js
//
//  (The grammar file can be found in the Lark repo:
//   https://github.com/lark-parser/lark/blob/master/lark/grammars/python.lark)
//
// Then we can run it with
//
//      node run_python_parser.js
//

var {get_parser, PythonIndenter} = require('./python_parser.js')

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

    let text = `
(a, b,
c) = d
`

    // let tree = parser.parse(text)
    // console.log( (new PythonIndenter().always_accept ))
}

