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
        console.log("gnerate [templateName] [destination]  -  Generate a new file from a template to a path relative to the cwd.");
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
        if (args.help || args.man) {
            Gnerate.showManPage();
            return;
        }
        if (args.version) {
            const pkg = require("../../package.json");
            console.log(`Gnerate: ${pkg.version}`);
            return;
        }
        if (args.init) {
            console.log("\nGenerating config file..");
            return this.initialize();
        }
        if (!args.template) {
            console.log("\nTemplate name was not provided to gnerate.");
            return;
        }
        if (!args.dest) {
            console.log("\nDestination was not provided to gnerate.");
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
                try {
                    templatePath = this.resolveTemplatePath();
                }
                catch (exception) {
                    console.log(exception);
                    return;
                }
            }
            const params = this.createParameters(configContents && configContents.parameters || {}, args);
            if (configContents && configContents.alias && configContents.alias[args.template]) {
                this.generateFromAlias(configContents.alias[args.template], templatePath, params, args.dest);
                return;
            }
            try {
                const template = yield Gnerate.getTemplateString(templatePath, args.template);
                yield this.generateFileFromTemplate(template, params, args.dest);
                console.log(`\n\t${args.dest} has been sucessfully generated!\n\n`);
            }
            catch (exception) {
                console.log(exception.toString());
            }
        });
    }
    static createParameters(parameters, args) {
        const fileParts = Utilities_1.default.getFileNameAndExtension(args.dest);
        return Object.assign({}, {
            filename: fileParts[0],
            fileExtension: fileParts[1],
        }, this.getAdditionalParameters(parameters, args));
    }
    static generateFileFromTemplate(template, parameters, dest) {
        return __awaiter(this, void 0, void 0, function* () {
            const renderedTemplate = nunjucks_1.renderString(template, parameters);
            try {
                return yield Gnerate.writeToDestination(renderedTemplate, dest);
            }
            catch (exception) {
                throw `\nCould not write template to (${exception.path})` +
                    `\nMaybe invalid permissions, or trying to write over a directory?` +
                    `\n\n${exception}`;
            }
        });
    }
    static generateFromAlias(templatesToGenerate, templatePath, params, dest) {
        const items = Object.keys(templatesToGenerate);
        items.forEach((key) => __awaiter(this, void 0, void 0, function* () {
            const template = yield Gnerate.getTemplateString(templatePath, key);
            const filename = templatesToGenerate[key].filename;
            const fileParts = Utilities_1.default.getFileNameAndExtension(filename);
            try {
                Gnerate.generateFileFromTemplate(template, params, dest + filename);
                console.log(`\tFile ${dest + filename} has been sucessfully generated!`);
            }
            catch (exception) {
                console.log(exception.toString());
                return;
            }
        }));
    }
    static getAdditionalParameters(params, args) {
        const argParams = Object.keys(args).reduce((accu, item) => {
            if (item !== "config" &&
                item !== "templatePath" &&
                item !== "init" &&
                item !== "template" &&
                item !== "dest") {
                accu[item] = args[item];
            }
            return accu;
        }, {});
        return Object.assign({}, params, argParams);
    }
    static resolveTemplatePath() {
        return path_1.resolve(process.cwd(), "__templates__");
    }
    static getConfigContents(config = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedConfig = typeof config === "string" ?
                    yield Utilities_1.default.getFileContents(config) :
                    config;
                return parsedConfig || null;
            }
            catch (exception) {
                throw exception;
            }
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
                throw `\n\nCould not find the template: ${templatePath}/${templateName}.` +
                    `\nEither the template doesn't exist, or an alias name is missing.`;
            }
        });
    }
}
exports.default = Gnerate;
