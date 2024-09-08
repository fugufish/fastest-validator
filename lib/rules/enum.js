"use strict";

/**	Signature: function(value, field, parent, errors, context)
 */
module.exports = function({ schema, messages }, path, context) {
	const values = schema.values || (schema.props && schema.props.enum) ? schema.props.enum : [];

	const enumStr = JSON.stringify(values);
	return {
		source: `
			if (${enumStr}.indexOf(value) === -1)
				${this.makeError({ type: "enumValue", expected: "\"" + values.join(", ") + "\"", actual: "value", messages })}

			return value;
		`
	};
};
