import { resolve, join } from "path";
import { renderString } from "nunjucks";
import { lstatSync, readdirSync } from "fs";
import Utilities from "./Utilities";
import File from "./File";

import IArguments from "../Interfaces/IArguments";
import IConfig from "../Interfaces/IConfig";

export default class Gnerate {
  /**
     * Show instructions on how to use Gnerate
     */
  public static showManPage() {
    console.log("==========  gnerate  ==========");
    console.log("gnerate --init - Initializes the project with a gnerate config");
    console.log(
      "gnerate [templateName] [path/name]  -  Generate a new file from a template to a path relative to the cwd."
    );
  }

  /**
     * This is used when the --init argument is used.
     * 
     * Gnerate uses itself, to build a config file!
     */
  public static initialize() {
    Gnerate.generate({
      dest: "./gnerate.config.js",
      template: "gnerate.config",
      config: {
        templatePath: resolve(__dirname, "../..", "__templates__"),
      },
    });
  }

  /**
     * Parse arguments, and kick of the gnerate process.
     * 
     * @param argv 
     */
  public static run(argv: string[]) {
    if (argv.length === 0) {
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

  /**
     * The backbone of gnerate.
     * This method will:
     *  * Parse the config file
     *  * Find the template file based on cli argument
     *  * Parse the template (Nunjucks) to a string
     *  * Write the parsed template to the specified location
     * 
     * @param args 
     */
  public static async generate(args: IArguments) {
    let configContents: IConfig;
    try {
      configContents = await this.getConfigContents(args.config);
    } catch (exception) {
      console.log(exception.toString());
      return;
    }

    let template: string;
    try {
      template = await this.getTemplateContents(configContents, args);
    } catch (exception) {
      console.log(exception.toString());
      return;
    }

    const fileParts = Utilities.getFileNameAndExtension(args.dest);

    const renderedTemplate = renderString(
      template,
      Object.assign(
        {},
        {
          filename: fileParts[0],
          fileExtension: fileParts[1],
        },
        configContents && configContents.parameters
      )
    );

    try {
      await Gnerate.writeToDestination(renderedTemplate, args.dest);
    } catch (exception) {
      console.log(`[Error]: ${exception.toString()}`);
      return;
    }

    console.log(`\n\n\tFile ${args.dest} has been sucessfully generated!\n\n`);
  }

  /**
     * Gets the contents of the template component. (precompiled)
     * 
     * @param configContents 
     * @param args 
     * 
     * @return {Promise<string>}
     */
  public static async getTemplateContents(
    configContents: IConfig,
    args: IArguments
  ): Promise<string> {
    let templatePath = configContents && configContents.templatePath;

    if (!templatePath) {
      const getDirectories = (source: string) =>
        readdirSync(source).map(name => join(source, name));

      const path = resolve(process.cwd(), "__templates__");
      const foundTemplates = getDirectories(path);

      if (foundTemplates && foundTemplates.length > 0) {
        templatePath = path;
      } else {
        throw "Could not find a __templates__ directory, or config file containing templates path.";
      }
    }

    return Gnerate.getTemplateString(templatePath, args);
  }

  /**
     * Gets the contents of the gnerate config file
     * 
     * @param config 
     * 
     * @return {Promise<IConfig>}
     */
  public static async getConfigContents(config: string | IConfig): Promise<IConfig> {
    let configContents: IConfig = null;

    if (config) {
      configContents =
        typeof config === "string" ? await Utilities.getFileContents(config) : config;
    }

    return configContents;
  }

  /**
     * 
     * @param destination 
     * @param template 
     * 
     * @return {Promise<boolean>} Writes a template string to a file location
     */
  public static async writeToDestination(template: string, destination: string): Promise<boolean> {
    const output = new File(destination);

    return await output.writeContents(template);
  }

  /**
     * Find and read the contents of a specified template file.
     * 
     * @param templatePath 
     * @param args 
     * 
     * @return {Promise<string>} The template as a string
     */
  public static async getTemplateString(templatePath: string, args: IArguments): Promise<string> {
    try {
      const templateFile = await Utilities.findTemplate(templatePath, args.template);

      return await templateFile.getContents();
    } catch (exception) {
      throw `
                Could not find or render the template ${templatePath} ${args.template}.
                [Error]: ${exception}
            `;
    }
  }
}
