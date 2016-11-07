'use strict';

var assert = require('assert');
var describe = require('mocha').describe;
var it = require('mocha').it;

var findReferences = require('../index');

var simpleTestObj = {
    title: 'TestObject',
    address: {
        lines: [
            'Cap Oméga',
            'Rond Point Benjamin Franklin'
        ],
        zip: 34960,
        city: 'MONTPELLIER',
        country: {
            code: 'FR',
            label: 'France'
        }
    },
    events: [
        {
            date: new Date(),
            topics: {
                web: 'innovative web platforms',
                music: 'connected gloves',
                sport: 'iPhone coaching app'
            },
            speakers: [{name: 'Romain Bessuges'}]
        }
    ]
};

var circularChild = {
    name: 'Child'
};

var circularParent = {
    name: 'Parent'
};

circularChild.parent = circularParent;
circularParent.child = circularChild;

describe('simple property access', function () {
    var refs = findReferences(simpleTestObj, ['title']);
    it('should return only one ref', function () {
        assert.equal(1, refs.length);
    });
    it('should return the title ref', function () {
        assert.equal('TestObject', refs[0].get());
    });
    console.info(refs[0]);
});

describe('nested property access', function () {
    var refs = findReferences(simpleTestObj, ['address', 'city']);
    it('should return only one ref', function () {
        assert.equal(1, refs.length);
    });
    it('should return MONTPELLIER', function () {
        assert.equal('MONTPELLIER', refs[0].get());
    });
    it('should overwrite object value', function () {
        refs[0].set('MONTPELLIER CEDEX');
        assert.equal('MONTPELLIER CEDEX', refs[0].get());
        assert.equal('MONTPELLIER CEDEX', simpleTestObj.address.city);
    });
});

describe('find array ref', function () {
    var refs = findReferences(simpleTestObj, ['address', 'lines']);
    it('should be an array', function () {
        assert.ok(Array.isArray(refs[0].get()));
    });
    it('should overwrite', function () {
        refs[0].get().push('CEDEX 3323');
        assert.ok(simpleTestObj.address.lines.length === 3);
    });
});

describe('find object ref', function () {
    var refs = findReferences(simpleTestObj, ['address']);
    it('should be an object', function () {
        assert.ok(typeof refs[0].get() === 'object');
    });
    it('should have a lines property', function () {
        assert.ok(typeof refs[0].get()['lines'] !== 'undefined');
    });
});

describe('array iteration', function () {
    var refs = findReferences(simpleTestObj, ['address', 'lines', '*']);

    it('should return two (2) refs', function () {
        assert.equal(2, refs.length);
    });
    it('should return the good ones', function () {
        assert.equal('Cap Oméga', refs[0].get());
        assert.equal('Rond Point Benjamin Franklin', refs[1].get());
    });
    it('should overwrite item value', function () {
        refs[0].set('CAP OMÉGA');
        assert.equal('CAP OMÉGA', refs[0].get());
        assert.equal('CAP OMÉGA', simpleTestObj.address.lines[0]);
    });
});

describe('object properties iteration', function () {
    var refs = findReferences(simpleTestObj, ['events', '*', 'topics', '*']);
    it('should have find three refs', function () {
        assert.equal(3, refs.length);
    });
});

describe('circular structure', function () {
    var refs = findReferences(circularParent, ['child', 'parent', 'name']);

    it('should work', function () {
        assert(refs.length === 1);
    });
    it('should be equal to "Parent"', function () {
        assert.equal('Parent', refs[0].get());
    });
});

describe('wrong paths', function () {

    /**
     * @param {Array<String>} path
     */
    function nothing(path) {
        assert.equal(0, findReferences(simpleTestObj, path).length);
    }

    it('should not find anything', function () {
        nothing(['undefinedField']);
        nothing(['title', 'test']);
    });
});