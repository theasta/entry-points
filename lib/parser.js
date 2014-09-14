var addNewElements = function (fromArray, toArr) {
    fromArray.forEach(function (el) {
        if (toArr.indexOf(el) === -1) { toArr.push(el); }
    });
    return toArr;
};
module.exports = {

    init: function (jsonData) {
        this.entryPoints = jsonData;
        return this;
    },

    getEntries: function () {
        return Object.keys(this.entryPoints);
    },

    getParentsFor: function (bundleName) {
        var deps = [];
        var directParents = this.getDirectParentsFor(bundleName);
        if (directParents) {
            deps = addNewElements(directParents, deps);
            directParents.forEach(function (subBundleName) {
                deps = addNewElements(this.getParentsFor(subBundleName), deps);
            }.bind(this));
        }
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
        return allAncestors.reverse();
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