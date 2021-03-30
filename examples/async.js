const Validator = require("../index");

const v = new Validator({
	debug: true,
	useNewCustomCheckerFunction: true,
	async: true
});

// Register a custom 'even' validator
v.add("even", function({ messages }) {
	return {
		source: `
            if (value % 2 != 0)
                ${this.makeError({ type: "evenNumber",  actual: "value", messages })}

			await new Promise(resolve => setTimeout(resolve, 1000));

            return value;
        `
	};
});
v.addMessage("evenNumber", "The '{field}' field must be an even number! Actual: {actual}");

const schema = {
	name: {
		type: "string",
		min: 4,
		max: 25,
		custom: async (v) => {
			await new Promise(resolve => setTimeout(resolve, 1000));
			return v.toUpperCase();
		}
	},

	username: {
		type: "custom",
		custom: async (v) => {
			// E.g. checking in the DB that whether is unique.
			await new Promise(resolve => setTimeout(resolve, 1000));
			return v.trim();
		}
	},

	age: {
		type: "even"
	}
};

const check = v.compile(schema);

(async function() {
	const data = {
		name: "John Doe",
		username: "johndoe   ",
		age: 21
	};
	console.log(await check(data), data);
})();
