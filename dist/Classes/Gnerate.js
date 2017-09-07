"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utilities_1 = require("./Utilities");
class Gnerate {
    static showManPage() {
        console.log("==========  rgen  ==========");
        console.log("rgen [templateName] [path/name]  -  Generate a new file from a template to a path relative to the cwd.");
    }
    static run(argv) {
        if (argv.length <= 1) {
            console.log("rgen requires two arguments.");
            Gnerate.showManPage();
            return;
        }
        const args = Utilities_1.default.parseArguments(argv);
        if (!args.template || !args.dest) {
            console.log("[template] or [destination] missing in rgen command.");
            return;
        }
        Utilities_1.default.generate(args);
    }
}
exports.default = Gnerate;
//# sourceMappingURL=Gnerate.js.map