/*
 * specify.js
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

(function () {

    // simple object extend function for internal use
    function extend(target, source) {
        for (var name in source) {
            if (source[name] !== undefined) {
                target[name] = source[name];
            }
        }
        return target;
    }

    var specify = window.specify = function (name, specs) {
        specify.runner.runGroup(name, specs);
    };

    extend(specify, {
        pass: function () {
            throw { status : "passed", message : "passed" };
        },
        fail: function (message) {
            throw { status : "failed", message : message || "failed" };
        },
        pending: function (message) {
            throw { status : "pending", message : message || "is pending" };
        },

        equal: function (value, expected, message) {
            if (value !== expected) {
                this.fail(message || "expected " + expected + " but got " + value);
            }
        },
        unequal: function (value, unexpected, message) {
            if (value === unexpected) {
                this.fail(message || "nobody expects the Spanish Inq.. " + unexpected + " value but got it");
            }
        }
    });

    specify.log = {
        passed: function () {
            console.info.apply(this, arguments);
        },
        failed: function () {
            console.error.apply(this, arguments);
        },
        pending: function () {
            console.warn.apply(this, arguments);
        },
        group: function () {
            console.group.apply(this, arguments);
        },
        groupEnd: function () {
            console.groupEnd.apply(this, arguments);
        }
    };

    specify.runner = {
        runGroup: function (name, specs) {
            specify.log.group(name);
            
            for (var spec in specs) {
                if (specs.hasOwnProperty(spec)) {
                    this.run(spec, specs[spec]);
                }
            }
            
            specify.log.groupEnd();
        },

        run: function (name, test) {
            try {
                test.apply(specify.expectation);
                specify.pass();
            } catch (result) {
                if (result.status) {
                    specify.log[result.status](name, "--", test, result.message);
                } else {
                    throw result;
                }
            }
        }
    };

    specify.expectation = function (value) {
        return {
            should_be: function (expected, message) {
                return specify.equal(value, expected, message);
            },

            should_not_be: function (unexpected, message) {
                return specify.unequal(value, unexpected, message);
            },

            should_be_a: function (expectedType, message) {
                if (expectedType.constructor === Function) {
                    value = value.constructor;
                } else {
                    value = typeof value;
                }
                return specify.equal(value, expectedType, message);
            },

            should_be_true: function (message) {
                return specify.equal(!!value, true, message || "expected " + value + " to be true");
            }
        };
    };

    extend(specify.expectation, {
        pass: specify.pass,
        is_ok: specify.pass,

        fail: specify.fail,
        is_not_ok: specify.fail,

        pending: specify.pending,
        is_pending: specify.pending
    });

}());
