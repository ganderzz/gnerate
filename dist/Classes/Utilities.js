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
const fs = require("fs");
const nunjucks_1 = require("nunjucks");
const File_1 = require("./File");
class Utilities {
    static parseArguments(args) {
        return args.reduce((accu, current) => {
            if (current.indexOf("--") > -1) {
                const keyValue = current.split("--")[1].split("=");
                return Object.assign({ [keyValue[0]]: keyValue[1] || true }, accu);
            }
            if (!accu.template) {
                return Object.assign({ template: current }, accu);
            }
            if (!accu.dest) {
                return Object.assign({ dest: current }, accu);
            }
            return accu;
        }, {});
    }
    static findTemplate(templatePath, templateName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => fs.readdir(templatePath, (error, files) => {
                const foundFile = files.filter(name => name.indexOf(templateName) > -1);
                if (foundFile.length === 0 || foundFile.length > 1) {
                    reject(`Could not resolve the template name ${templateName} given at ${templatePath}`);
                }
                resolve(new File_1.default(`${templatePath}/${foundFile[0]}`));
            }));
        });
    }
    ;
    static getConfigContents(configPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const configFile = new File_1.default(configPath);
            if (!configFile.exists()) {
                throw `Could not find config file: ${configPath}`;
            }
            return yield require(configFile.toString());
        });
    }
    static getFileName(filename) {
        return filename.replace(/^.*[\\\/]/, "").split(".")[0];
    }
    static generate(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const configContents = typeof args.config === "string" ?
                yield Utilities.getConfigContents(args.config) :
                args.config;
            const templates = new File_1.default(configContents.templatePath);
            if (!templates.exists()) {
                console.log(`Could not find templates folder: ${templates}`);
                return;
            }
            const templateFile = yield Utilities.findTemplate(configContents.templatePath, args.template);
            const templateContents = nunjucks_1.renderString(yield templateFile.getContents(), Object.assign({ filename: Utilities.getFileName(args.dest) }, configContents.parameters));
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
exports.default = Utilities;
//# sourceMappingURL=Utilities.js.map