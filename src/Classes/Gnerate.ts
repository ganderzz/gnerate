import { resolve } from "path";
import { renderString } from "nunjucks";
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

    public static initialize(): Promise<void> {
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
