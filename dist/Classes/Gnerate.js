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
const fs_1 = require("fs");
const Utilities_1 = require("./Utilities");
const File_1 = require("./File");
class Gnerate {
    static showManPage() {
        console.log("==========  gnerate  ==========");
        console.log("gnerate --init - Initializes the project with a gnerate config");
        console.log("gnerate [templateName] [path/name]  -  Generate a new file from a template to a path relative to the cwd.");
    }
    static initialize() {
        Gnerate.generate({
            dest: "./gnerate.config.js",
            template: "gnerate.config",
            config: {
                templatePath: path_1.resolve(__dirname, "../..", "__templates__"),
            },
        });
        File_1.default.createDirectory("./__templates__");
        console.log("\tDirectory __templates__ has been sucessfully generated!");
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
            let configContents;
            try {
                configContents = yield this.getConfigContents(args.config);
            }
            catch (exception) {
                console.log(exception.toString());
                return;
            }
            let templatePath = args.templatePath;
            if (!templatePath) {
                templatePath = configContents && configContents.templatePath;
            }
            if (!templatePath) {
                templatePath = this.resolveTemplatePath();
            }
            const parameters = configContents && configContents.parameters || {};
            const template = yield Gnerate.getTemplateString(templatePath, args.template);
            try {
                Gnerate.generateFileFromTemplate(template, parameters, args);
            }
            catch (exception) {
                console.log(exception.toString());
                return;
            }
            console.log(`\n\n\tFile ${args.dest} has been sucessfully generated!\n\n`);
        });
    }
    static generateFileFromTemplate(template, parameters, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileParts = Utilities_1.default.getFileNameAndExtension(args.dest);
            const renderedTemplate = nunjucks_1.renderString(template, Object.assign({}, {
                filename: fileParts[0],
                fileExtension: fileParts[1],
            }, this.getAdditionalParameters(parameters, args)));
            try {
                yield Gnerate.writeToDestination(renderedTemplate, args.dest);
            }
            catch (exception) {
                throw exception;
            }
        });
    }
    static getAdditionalParameters(params, args) {
        const argParams = Object.keys(args).reduce((accu, item) => {
            if (item !== "config" &&
                item !== "templatePath" &&
                item !== "init" &&
                item !== "template" &&
                item !== "dist") {
                accu[item] = args[item];
            }
            return accu;
        }, {});
        return Object.assign({}, params, argParams);
    }
    static resolveTemplatePath() {
        const getDirectories = (source) => fs_1.readdirSync(source).map(name => path_1.join(source, name));
        const path = path_1.resolve(process.cwd(), "__templates__");
        const foundTemplates = getDirectories(path);
        if (!foundTemplates || foundTemplates.length > 1) {
            throw "Could not find a __templates__ directory, or config file containing templates path.";
        }
        return path;
    }
    static getConfigContents(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let configContents = null;
            if (config) {
                configContents =
                    typeof config === "string" ? yield Utilities_1.default.getFileContents(config) : config;
            }
            return configContents;
        });
    }
    static writeToDestination(template, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            const output = new File_1.default(destination);
            return yield output.writeContents(template);
        });
    }
    static getTemplateString(templatePath, templateName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const templateFile = yield Utilities_1.default.findTemplate(templatePath, templateName);
                return yield templateFile.getContents();
            }
            catch (exception) {
                throw `
                Could not find the template: ${templatePath}/${templateName}.
                [Error]: ${exception}
            `;
            }
        });
    }
}
exports.default = Gnerate;
//# sourceMappingURL=Gnerate.js.map