export default class Rgen {
    public constructor(argv: string[]) {
        this._arguments = argv;
    }

    public showManPage() {
        console.log("==========  rgen  ==========");
        console.log("rgen [templateName] [path/name]  -  Generate a new file from a template to a path relative to the cwd.");
    }

    public run() {
        if(this._arguments.length <= 2) {
            console.log("Missing commands.");
            this.showManPage();
        
            return;
        }
    }

    private readonly _arguments: string[];
}
