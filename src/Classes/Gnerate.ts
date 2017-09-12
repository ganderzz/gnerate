import { resolve, join } from "path";
import { renderString } from "nunjucks";
import { lstatSync, readdirSync } from "fs";
import Utilities from "./Utilities";
import File from "./File";

import IArguments from "../Interfaces/IArguments";
import IConfig from "../Interfaces/IConfig";

export default class Gnerate {
    public static showManPage() {
        console.log("==========  gnerate  ==========");
        console.log("gnerate --init - Initializes the project with a gnerate config");
        console.log("gnerate [templateName] [path/name]  -  Generate a new file from a template to a path relative to the cwd.");
    }

    public static initialize(): Promise<boolean> {
        return Gnerate.generate({
            dest: "./gnerate.config.js",
            template: "gnerate.config",
            config: {
                templatePath: resolve(__dirname, "../..", "__templates__"),
            }
        });
    }

    public static run(argv: string[]) {
        if(argv.length === 0) {
            console.log("\nMissing arguments.");
            Gnerate.showManPage();
        
            return;
        }

        const args = Utilities.parseArguments(argv);

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

    public static async generate(args: IArguments) {
        let configContents: IConfig = null;
        if (args.config) {
            configContents = typeof args.config === "string" ? 
                await Utilities.getConfigContents(args.config) :
                args.config
        }

        let templatePath: string = configContents && configContents.templatePath;

        if (!templatePath) {
            const getDirectories = (source: string) =>
              readdirSync(source).map(name => join(source, name))

            const path = resolve(process.cwd(), "__templates__");
            const foundTemplates = getDirectories(path);
            
            if (foundTemplates && foundTemplates.length > 0) {
                templatePath = path;
            } else {
                throw "Could not find a __templates__ directory, or config file containing templates path.";
            }
        }

        console.log(templatePath, args.template)

        const template = await Gnerate.getTemplateString(templatePath, args);

        const renderedTemplate = renderString(template, Object.assign({}, {
            filename: Utilities.getFileName(args.dest),
        }, configContents && configContents.parameters));

        return Gnerate.createOutputFile(args.dest, renderedTemplate);
    }

    public static async createOutputFile(destination: string, template: string): Promise<boolean> {
        const output = new File("./");
        const write = await output.writeContents(destination, template);

        if (write === true) {
            console.log(`\n\nFile ${destination} has been generated.\n`);

            return true;
        }

        console.log(`\nError creating file ${destination}: ${write.toString()}`);

        return false;
    }

    public static async getTemplateString(templatePath: string, args: IArguments): Promise<string> {
        try {
            const templateFile = await Utilities.findTemplate(templatePath, args.template);
            
            return await templateFile.getContents();
        } catch {
            throw `Could not find or render the template ${templatePath} ${args.template}.`;
        }   
    }
}
