from subprocess import Popen, PIPE

from larkjs.__main__ import generate_js_standalone
from lark import Lark

TEST_CODE = r"""

const parser = get_parser({transformer})

console.log(JSON.stringify(parser.parse(input_text)))
"""

    
class JsParser:
    def __init__(self, lark_instance):
        self.code = generate_js_standalone(lark_instance)

    def parse(self, text, transformer=None):
        js_code = self.code
        js_code += 'const input_text = `' + text + '`;'
        if transformer:
            js_code += transformer
        js_code += TEST_CODE

        p = Popen(["node", "-"], stdin=PIPE, stdout=PIPE, stderr=PIPE)
        stdout, stderr = p.communicate(js_code.encode())

        if stderr:
            raise ValueError(stderr.decode())
        return stdout.decode()
        
    


def test_json_parser():
    parser = Lark.open('json.lark', rel_to=__file__, parser="lalr")
    js_parser = JsParser(parser)

    transformer = """
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
    """

    text = r"""
    {
        "empty_object" : {},
        "empty_array"  : [],
        "booleans"     : { "YES" : true, "NO" : false },
        "numbers"      : [ 0, 1, -2, 3.3, 4.4e5, 6.6e-7 ],
        "strings"      : [ "This", [ "And" , "That", "And a \\"b" ] ],
        "nothing"      : null
    }
    """
    
    res = js_parser.parse(text, transformer)
    expected = r"""{"empty_object":{},"empty_array":[],"booleans":{"YES":true,"NO":false},"numbers":[0,1,-2,3.3,440000,6.6e-7],"strings":["This",["And","That","And a \\\"b"]],"nothing":null}"""
    assert res.strip() == expected

def test():
    test_json_parser()

if __name__ == '__main__':
    test()