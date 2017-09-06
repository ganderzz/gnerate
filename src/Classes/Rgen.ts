export default class Rgen {
    public static showManPage() {
        console.log("==========  rgen  ==========");
        console.log("rgen [templateName] [path/name]  -  Generate a new file from a template to a path relative to the cwd.");
    }

    public static run(argv: string[]) {
        if(argv.length <= 1) {
            console.log("Missing commands.");
            Rgen.showManPage();
        
            return;
        }
    }
}
