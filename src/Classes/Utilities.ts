import * as fs from "fs";
import { renderString } from "nunjucks";

import IConfig from "../Interfaces/IConfig";
import File from "./File";

interface IArgs {
    dest: string;
    template: string;
    config: string | IConfig;
    init?: boolean;
}

export default class Utilities {

    // @todo: Break this up into smaller functions
    public static parseArguments(args: string[]): IArgs {
        return args.reduce((accu: IArgs, current: string) => {
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
        }, {}) as IArgs;
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

    public static async generate(args: IArgs) {
        const configContents: IConfig = typeof args.config === "string" ? 
            await Utilities.getConfigContents(args.config) :
            args.config;

        const templates = new File(configContents.templatePath);

        if (!templates.exists()) {
            console.log(`Could not find templates folder: ${templates}`);
            return;
        }

        const templateFile = await Utilities.findTemplate(configContents.templatePath, args.template);
        const templateContents = renderString(await templateFile.getContents(), {
            filename: Utilities.getFileName(args.dest),
            ...configContents.parameters
        });

        const output = new File("./");
        const write = await output.writeContents(args.dest, templateContents);
        if (write === true) {
            console.log(`\n\nFile ${args.dest} has been generated.\n`);
            return;
        }

        console.log(`\nError creating file ${args.dest}: ${write.toString()}`);
    }
}
