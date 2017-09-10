import * as fs from "fs";

import IArguments from "../Interfaces/IArguments";
import IConfig from "../Interfaces/IConfig";
import File from "./File";

export default class Utilities {

    // @todo: Break this up into smaller functions
    public static parseArguments(args: string[]): IArguments {
        return args.reduce((accu: IArguments, current: string) => {
            // Parse out options if they exist
            // These will always lead with -- separated by = (--config=./test.config)
            if (current.indexOf("--") > -1) {
                const keyValue = current.split("--")[1].split("=");

                return {
                    [keyValue[0]]: keyValue[1] || true,
                    ...accu
                };
            }

            // First non-option value will always be the template name
            if (!accu.template) {
                return {
                    template: current,
                    ...accu
                };
            }

            // Second non-option value will always be the destination
            if (!accu.dest) {
                return {
                    dest: current,
                    ...accu
                };
            }

            return accu;
        }, {}) as IArguments;
    }

    public static async findTemplate(templatePath: string, templateName: string) {
        return new Promise<File>((resolve, reject) =>
            fs.readdir(templatePath, (error: NodeJS.ErrnoException, files: string[]) => {
                const foundFile = files.filter(name => name.indexOf(templateName) > -1);

                if (foundFile.length === 0 || foundFile.length > 1) {
                    reject(`Could not resolve the template name ${templateName} given at ${templatePath}`);
                }

                resolve(new File(`${templatePath}/${foundFile[0]}`));
            })
        );
    };

    public static async getConfigContents(configPath: string): Promise<IConfig> {
        const configFile = new File(configPath);

        if (!configFile.exists()) {
            throw `Could not find config file: ${configPath}`;
        }

        return await require(configFile.toString());
    }

    public static getFileName(filename: string): string {
        return filename.replace(/^.*[\\\/]/, "").split(".")[0];
    }
}
