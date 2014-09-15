var fs = require('fs');
var esprima = require('esprima');
var _ = require('lodash');
var glob = require('glob');

var getParents = function (file) {
    var parents = [];
    var ast = esprima.parse(fs.readFileSync(file), { attachComment: true });
    if (ast.comments) {
        var comments = _.pluck(ast.comments, 'value').join(' ');
        var regExp = /@parent\s*([\w-/]*)\b/g;
        var results;
        while ((results = regExp.exec(comments)) != null) {
            parents.push(results[1]);
        }
    }
    return parents;
};

module.exports = function (folder) {

    // @todo add options: onlyProjects, excludeProject

    var files = glob.sync(folder + "/**/*.js");
    var tree = {};
    files.forEach(function (filepath) {
        var key = filepath.replace(folder + '/', '').replace('.js', '');
        tree[key] = getParents(filepath);
    });

    return tree;
};