var mapper = require('./lib/mapper');
var parser = require('./lib/parser');

module.exports = {
    mapper: mapper,
    parser: function (folder) {
        var jsonData = mapper(folder);
        return parser.init(jsonData);
    }
};