import Utilities from "./Utilities";

export default class Gnerate {
    public static showManPage() {
        console.log("==========  gnerate  ==========");
        console.log("gnerate [templateName] [path/name]  -  Generate a new file from a template to a path relative to the cwd.");
    }

    public static run(argv: string[]) {
        if(argv.length <= 1) {
            console.log("\ngnerate requires two arguments.");
            Gnerate.showManPage();
        
            return;
        }

        const args = Utilities.parseArguments(argv);
        
        if (!args.template || !args.dest) {
            console.log("[template] or [destination] missing in rgen command.");

            return;
        }

        Utilities.generate(args);
    }
}
