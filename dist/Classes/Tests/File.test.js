"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const File_1 = require("../File");
ava_1.default("Test file contains file name.", (t) => {
    let file = new File_1.default("test");
    t.true(file.toString().indexOf("test") > 0);
});
//# sourceMappingURL=File.test.js.map