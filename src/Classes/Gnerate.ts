import { resolve } from "path";
import Utilities from "./Utilities";
import File from "./File";

export default class Gnerate {
    public static showManPage() {
        console.log("==========  gnerate  ==========");
        console.log("gnerate --init - Initializes the project with a gnerate config");
        console.log("gnerate [templateName] [path/name]  -  Generate a new file from a template to a path relative to the cwd.");
    }

    public static initialize(): Promise<void> {
        return Utilities.generate({
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

        return Utilities.generate(args);
    }
}
