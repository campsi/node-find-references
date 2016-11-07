/**
 *
 * @param {Object} container
 * @param {String} propName
 * @constructor
 */
const Reference = function (container, propName) {
    this.container = container;
    this.propName = propName;
};

Reference.prototype.get = function () {
    return this.container[this.propName];
};
Reference.prototype.set = function (value) {
    this.container[this.propName] = value;
};

/**
 *
 * @param {Object} obj
 * @param {Array} path
 * @returns {Array<Reference>}
 */
const findReferences = function (obj, path) {
    const prop = path.shift();
    const val = obj[prop];
    const typeofVal = typeof val;
    let refs = [];

    if (Array.isArray(obj) && prop === '*') {
        for (let i = 0; i < obj.length; i++) {
            refs = refs.concat(findReferences(obj, [i].concat(path)));
        }
        return refs;
    }

    if (typeof obj === 'object' && prop === '*') {
        for (let valProp in obj) {
            if (obj.hasOwnProperty(valProp)) {
                refs = refs.concat(findReferences(obj, [valProp].concat(path)));
            }
        }
        return refs;
    }

    if (typeofVal === 'undefined' || val === null) {
        return [];
    }

    if (path.length === 0) {
        return [new Reference(obj, prop)]
    }

    return findReferences(val, path);
};

findReferences.Reference = Reference;

module.exports = findReferences;
