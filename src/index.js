#!/usr/bin/env node
"use strict";
const minimalist = require("minimist");
const fs = require("fs");
function showManPage() {
    console.log("=====  rgen  =====");
    console.log("container [name]  -  Generate a container with the name");
    console.log("component [name]  -  Generate a component with the name");
}
if (process.argv.length <= 2) {
    console.log("Missing commands.");
    showManPage();
    return;
}
const args = minimalist(process.argv.slice(2));
//# sourceMappingURL=index.js.map