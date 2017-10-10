const path = require("path");

module.exports = {
    templatePath: path.resolve(__dirname, "./__templates__"),
    alias: {
        base: {
            component: { filename: "component.js" },
            reducer: { filename: "reducer.js" }
        }
    }
};
