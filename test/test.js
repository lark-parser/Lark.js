const {TestTrees} = require("./test_trees.js");

function run_test_class(cls) {
	describe(cls.constructor.name, function() {

		let test = new cls();
		test.setUp();
		let test_names = Object.getOwnPropertyNames(cls.prototype).filter((prop) => prop.startsWith("test_"))
		for (const name of test_names) {
			it(name, () => {test[name]()})
		}
	});
}

run_test_class(TestTrees);