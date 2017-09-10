"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const nunjucks_1 = require("nunjucks");
const Utilities_1 = require("./Utilities");
const File_1 = require("./File");
class Gnerate {
    static showManPage() {
        console.log("==========  gnerate  ==========");
        console.log("gnerate --init - Initializes the project with a gnerate config");
        console.log("gnerate [templateName] [path/name]  -  Generate a new file from a template to a path relative to the cwd.");
    }
    static initialize() {
        return Gnerate.generate({
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
        return Gnerate.generate(args);
    }
    static generate(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const configContents = typeof args.config === "string" ?
                yield Utilities_1.default.getConfigContents(args.config) :
                args.config;
            const templates = new File_1.default(configContents.templatePath);
            if (!templates.exists()) {
                console.log(`Could not find templates folder: ${templates}`);
                return;
            }
            const templateFile = yield Utilities_1.default.findTemplate(configContents.templatePath, args.template);
            const templateContents = nunjucks_1.renderString(yield templateFile.getContents(), Object.assign({ filename: Utilities_1.default.getFileName(args.dest) }, configContents.parameters));
            const output = new File_1.default("./");
            const write = yield output.writeContents(args.dest, templateContents);
            if (write === true) {
                console.log(`\n\nFile ${args.dest} has been generated.\n`);
                return;
            }
            console.log(`\nError creating file ${args.dest}: ${write.toString()}`);
        });
    }
}
exports.default = Gnerate;
//# sourceMappingURL=Gnerate.js.map