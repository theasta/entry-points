var assert = require("assert");

var parser = require('../lib/parser').init(require('./fixtures/entry-points.json'));


describe('Entry Points Parser', function () {

    describe('#getEntries()', function () {
        it('should return the correct number of bundles', function () {
            assert.equal(parser.getEntries().length, 19);
        });
    });

    describe('#getParentsFor()', function () {
        it('should return an empty array for level1-a', function () {
            assert.equal(parser.getParentsFor('level1-a').length, 0);
        });
        it('should return an array of 1 for level2-a', function () {
            assert.equal(parser.getParentsFor('level2-a').length, 1);
        });
        it('should return an array of 2 for level3-a', function () {
            var dashboardAncestors = parser.getParentsFor('level3-a');
            assert.equal(dashboardAncestors.length, 2);
            assert.deepEqual(dashboardAncestors, ['level2-a', 'level1-a']);
        });
        it('should return an array of 3 for level4-a', function () {
            var ancestors = parser.getParentsFor('level4-a');
            assert.equal(ancestors.length, 3);
            assert.deepEqual(ancestors, ['level3-a', 'level2-a', 'level1-a']);
        });
        it('should return an array of 5 for multi', function () {
            var ancestors = parser.getParentsFor('multi');
            assert.equal(ancestors.length, 5);
            assert.deepEqual(ancestors, [ 'level4-a', 'level4-b', 'level3-a', 'level2-a', 'level1-a']);
        });
    });

    describe('#getParents()', function () {
        it('should return all the bundles that have children', function () {
            assert.deepEqual(parser.getParents(), [ 'level4-b', 'level4-a', 'level3-a', 'level2-c', 'level2-b', 'level2-a', 'level1-a' ]);
        });
    });

    describe('#getDirectChildren()', function () {
        it('should return all the bundles that have children', function () {
            assert.deepEqual(parser.getDirectChildren('level2-a'), [
                "level3-a",
                "level3-b",
                "level3-c",
                "level3-d",
                "level3-e"
            ]);
        });
    });

});