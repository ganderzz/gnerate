const path = require("path");
const package = require("../package.json");

module.exports = {
    "templatePath": path.resolve(__dirname, "__templates__/"),
    "parameters": {
        "version": package.version
    },
    "alias": {
        "base": ["component", "reducer"]
    }
};
