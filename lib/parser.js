var addNewElements = function (fromArray, toArr) {
    fromArray.forEach(function (el) {
        if (toArr.indexOf(el) === -1) { toArr.push(el); }
    });
    return toArr;
};

var compare = function (a, b) {
    var nbParentsForA = parser.getParentsFor(a).length;
    var nbParentsForB = parser.getParentsFor(b).length;
    if (nbParentsForA < nbParentsForB) {
        return 1;
    } else if (nbParentsForA > nbParentsForB) {
        return -1;
    }
    return 0;
};

var parser = {
    cache: {},
    init: function (jsonData) {
        this.entryPoints = jsonData;
        return this;
    },

    getEntries: function () {
        return Object.keys(this.entryPoints);
    },

    getParentsFor: function (bundleName) {
        if (this.cache.hasOwnProperty(bundleName)) {
            return this.cache[bundleName];
        }
        var deps = [];
        var directParents = this.getDirectParentsFor(bundleName);
        if (directParents) {
            deps = addNewElements(directParents, deps);
            directParents.forEach(function (subBundleName) {
                deps = addNewElements(this.getParentsFor(subBundleName), deps);
            }.bind(this));
        }
        this.cache[bundleName] = deps;
        return deps;
    },

    getDirectParentsFor: function (bundleName) {
        if (typeof this.entryPoints[bundleName] === "object" && this.entryPoints[bundleName].length) {
            return this.entryPoints[bundleName];
        }
    },

    getParents: function () {
        var allAncestors = [];
        for (var entry in this.entryPoints) {
            if (this.entryPoints.hasOwnProperty(entry)) {
                allAncestors = addNewElements(this.entryPoints[entry], allAncestors);
            }
        }

        // sortAncestors by number of total ancestors
        return allAncestors.sort(compare);
    },

    getDirectChildren: function (parent) {
        var children = [];
        for (var entry in this.entryPoints) {
            if (this.entryPoints.hasOwnProperty(entry)) {
                if (this.entryPoints[entry].indexOf(parent) !== -1) {
                    children.push(entry);
                }
            }
        }
        return children;
    }
};

module.exports = parser;