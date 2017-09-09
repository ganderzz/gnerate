"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const Utilities_1 = require("./Utilities");
class Gnerate {
    static showManPage() {
        console.log("==========  gnerate  ==========");
        console.log("gnerate --init - Initializes the project with a gnerate config");
        console.log("gnerate [templateName] [path/name]  -  Generate a new file from a template to a path relative to the cwd.");
    }
    static initialize() {
        return Utilities_1.default.generate({
            dest: "./gnerate.config.js",
            template: "gnerate.config",
            config: {
                templatePath: path_1.resolve(__dirname, "../..", "__templates__"),
            }
        });
    }
    static run(argv) {
        if (argv.length === 0) {
            console.log("\nMissing arguments.");
            Gnerate.showManPage();
            return;
        }
        const args = Utilities_1.default.parseArguments(argv);
        if (args.init) {
            console.log("\nGenerating config file..");
            return this.initialize();
        }
        if (!args.template || !args.dest) {
            console.log("\n[template] or [destination] missing in rgen command.");
            return;
        }
        return Utilities_1.default.generate(args);
    }
}
exports.default = Gnerate;
//# sourceMappingURL=Gnerate.js.map