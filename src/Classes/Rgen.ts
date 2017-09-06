import Utilities from "./Utilities";

export default class Rgen {
    public static showManPage() {
        console.log("==========  rgen  ==========");
        console.log("rgen [templateName] [path/name]  -  Generate a new file from a template to a path relative to the cwd.");
    }

    public static run(argv: string[]) {
        if(argv.length <= 1) {
            console.log("rgen requires two arguments.");
            Rgen.showManPage();
        
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
