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
const path = require("path");
class File {
    constructor(filename) {
        this._filename = path.resolve(filename);
    }
    exists() {
        return fs.existsSync(this._filename);
    }
    getJSONContents() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._readFile().then(data => new Promise((resolve, reject) => {
                try {
                    return resolve(JSON.parse(data.toString()));
                }
                catch (exception) {
                    reject(exception);
                }
            }));
        });
    }
    getContents() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._readFile().then(data => new Promise(resolve => resolve(data.toString())));
        });
    }
    writeContents(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs.writeFile(`${this._filename}`, data, (error) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(true);
                });
            });
        });
    }
    toString() {
        return this._filename.toString();
    }
    _readFile() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => fs.readFile(this._filename, (error, data) => {
                if (error) {
                    reject(error);
                }
                return resolve(data);
            }));
        });
    }
    static createDirectory(directoryName) {
        if (!fs.existsSync(directoryName)) {
            fs.mkdirSync(directoryName);
        }
    }
}
exports.default = File;
//# sourceMappingURL=File.js.map