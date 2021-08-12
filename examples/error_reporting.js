//
// Example of error reporting using Lark
// =====================================
//
// First, we must generate a JSON parser using:
//
//      lark-js json.lark -o json_parser.js
//
// Then we can run it with
//
//      node error_reporting.js

const {get_parser, Token} = require('./json_parser.js')

let transformer = {
    number: ([n])  => parseFloat(n.value),
    string: ([s])  => s.value.slice(1, -1),
    array:  Array.from,
    pair:   Array.from,
    object: Object.fromEntries,

    null: () => null,
    true: () => true,
    false: () => false,
}

const parser = get_parser({transformer})

function find_error(json_text) {
    try {
        let j = parser.parse(json_text)
    } catch (u) {
        exc_class = u.match_examples((x) => { return parser.parse(x) }, {
            "Missing Opening": ['{"foo": ]}',
                                 '{"foor": }}',
                                 '{"foo": }'],
            "Missing Closing": ['{"foo": [}',
                                 '{',
                                 '{"a": 1',
                                 '[1'],
            "Missing Comma": ['[1 2]',
                               '[false 1]',
                               '["b" 1]',
                               '{"a":true 1:4}',
                               '{"a":1 1:4}',
                               '{"a":"b" 1:4}'],
            "Trailing Comma": ['[,]',
                                '[1,]',
                                '[1,2,]',
                                '{"foo":1,}',
                                '{"foo":false,"bar":true,}']
        })
        if (!exc_class) throw u;
        return exc_class;
    }
}

function test_error_reporting() {
    const bad_samples = [
        '{"example1": "value"',
        '{"example2": ] '
    ]
    for (bad_sample of bad_samples) {
        console.log(find_error(bad_sample), '--', bad_sample)
    }

}

if (require && require.main === module) {
    test_error_reporting()
}
