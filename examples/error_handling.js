//
// Example of error handling using Lark
// ====================================
//
// First, we must generate a JSON parser using:
//
//      lark-js json.lark -o json_parser.js
//
// Then we can run it with
//
//      node error_handling.js

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

function ignore_errors(e) {
    // This function gets called whenever there is a parse error

    if (e.token.type === 'COMMA') {
        // Ignore a misplaced comma
        return true
    }
    else if (e.token.type === 'SIGNED_NUMBER') {
        // Unexpected number. Try to feed a comma and retry the number
        e.interactive_parser.feed_token(new Token('COMMA', ','))
        e.interactive_parser.feed_token(e.token)
        return true
    }

    // Unhandled error. Will stop parse and raise exception
    return true;
}

function test_error_handling() {
    const text = "[0 1, 2,, 3,,, 4, 5 6 ]"
    console.log( parser.parse(text, null, ignore_errors) )
}

if (require && require.main === module) {
    test_error_handling()
}
