/*
 * spec.js
 *
 * Very simple JavaScript test runner that used BDD-style notation (like RSpec)
 * and displays test results using browser console (so make sure you have Firebug
 * or console-enabled browser).
 *
 * Copyright (c) 2009 Bartek Szopka
 *
 * Licensed under MIT license.
 *
 */

(function(){

// simple object extend function for internal use
function extend(target, source){
	for(var name in source){
		if (source[name] !== undefined)
			target[name] = source[name];
	}
	return target;
}

spec = window.spec = function(name, specs) {
	spec.runner.runGroup(name, specs);
};

extend(spec, {
	pass: function() {
		throw { status : "passed", message : "passed" }
	},
	fail: function(message){
		throw { status : "failed", message : message || "failed" }
	},
	pending: function(message){
		throw { status : "pending", message : message || "is pending" }
	},

	equal: function(value, expected, message){
		if(value !== expected){
			this.fail(message || "expected " + expected + " but got " + value);
		}
	},
	unequal: function(value, unexpected, message){
		if(value === unexpected){
			this.fail(message || "nobody expects the Spanish Inq.. " + unexpected + " value but got it");
		}
	}
});

spec.log = {
	passed: function(){ console.info.apply(this, arguments); },
	failed: function(){ console.error.apply(this, arguments); },
	pending: function(){ console.warn.apply(this, arguments); },
	group: function(){ console.group.apply(this, arguments); },
	groupEnd: function(){ console.groupEnd.apply(this, arguments); }
};

spec.runner = {
	runGroup: function(name, tests){
		spec.log.group(name)

		var beforeEach = tests["beforeEach"];
		delete tests["beforeEach"];

		for(var test in tests){
			if(beforeEach) beforeEach.apply(spec.expectation);
			this.run(test, tests[test]);
		}
		spec.log.groupEnd();
	},

	run: function(name, test){
		try {
			test.apply(spec.expectation);
			spec.pass();
		} catch (result) {
			if(result.status){
				spec.log[result.status](name, "--", test, result.message);
			} else {
				throw result;
			}
		}
	}
}

spec.expectation = function(value){
	return {
		should_be: function(expected, message){
			return spec.equal(value, expected, message);
		},

		should_not_be: function(unexpected, message){
			return spec.unequal(value, unexpected, message);
		},

		should_be_a: function(expectedType, message){
			if(expectedType.constructor === Function) value = value.constructor
			else value = typeof value;
			return spec.equal(value, expectedType, message);
		},

		should_be_true: function(message){
			return spec.equal(!!value, true, message || "expected " + value + " to be true");
		}
	}
}

extend(spec.expectation, {
	pass: spec.pass,
	is_ok: spec.pass,

	fail: spec.fail,
	is_not_ok: spec.fail,

	pending: spec.pending,
	is_pending: spec.pending,
});

})();