import * as fs from "fs";
import { emoji } from "node-emoji";

import File from "./File";

interface IArgs {
    dest: string;
    template: string;
    [key: string]: string;
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

    public static parseTemplate(template: string, filename: string): string {
        let name = filename.trim().replace(/^.*[\\\/]/, "");
        if (name.indexOf(".") > -1) {
            name = name.split(".")[0];
        }
        
        return template.replace(/\$\{rgen.filename\}/g, name);
    }

    public static async generate(args: IArgs) {
        const configFile = new File(args.config);

        if (!configFile.exists()) {
            console.log(`Could not find config file: ${configFile}`);
            return;
        }

        const configContents = await configFile.getJSONContents();
        const templates = new File(configContents.templates);

        if (!templates.exists()) {
            console.log(`Could not find templates folder: ${templates}`);
            return;
        }

        const templateFile = await Utilities.findTemplate(configContents.templates, args.template);
        const templateContents = Utilities.parseTemplate(await templateFile.getContents(), args.dest);

        const output = new File("./");
        const write = await output.writeContents(args.dest, templateContents);
        if (write === true) {
            console.log(`\n\n${emoji.rocket}File ${args.dest} has been generated.\n`);
            return;
        }

        console.log(`\nError creating file ${args.dest}: ${write.toString()}`);
    }
}
