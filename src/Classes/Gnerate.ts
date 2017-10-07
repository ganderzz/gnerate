import { resolve, join } from "path";
import { renderString } from "nunjucks";
import { lstatSync, readdirSync } from "fs";
import Utilities from "./Utilities";
import File from "./File";

import IArguments from "../Interfaces/IArguments";
import IConfig from "../Interfaces/IConfig";

export default class Gnerate {
  // #region Static Methods
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

    File.createDirectory("./__templates__");

    console.log("\tDirectory __templates__ has been sucessfully generated!");
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

    // templatePath coming from the terminal has
    // the heighest priority
    let templatePath = args.templatePath;

    if (!templatePath) {
      // If the terminal doesn't contain a templatePath, check the config file
      templatePath = configContents && configContents.templatePath;
    }
    if(!templatePath) {
      // If neither the terminal or config file have the template
      // directory path, try to find a __templates__ directory ourselves
      templatePath = this.resolveTemplatePath();
    }

    let templatesToGenerate = [args.template];
    const aliaskeys = configContents.alias;

    if (configContents.alias && configContents.alias[args.template]) {
      templatesToGenerate = configContents.alias[args.template];
    }

    templatesToGenerate.forEach(async item => {
      const parameters = configContents && configContents.parameters || {};
      const template = await Gnerate.getTemplateString(templatePath, item);
  
      try {
        Gnerate.generateFileFromTemplate(template, parameters, args);
      } catch (exception) {
        console.log(exception.toString());
        return;
      }
    });

    console.log(`\n\n\tFile ${args.dest} has been sucessfully generated!\n\n`);
  }

  private static async generateFileFromTemplate(template: string, parameters: {}, args: IArguments) {
    const fileParts = Utilities.getFileNameAndExtension(args.dest);

    const renderedTemplate = renderString(
      template,
      Object.assign(
        {},
        {
          filename: fileParts[0],
          fileExtension: fileParts[1],
        },
        this.getAdditionalParameters(parameters, args)
      )
    );

    try {
      await Gnerate.writeToDestination(renderedTemplate, args.dest);
    } catch (exception) {
      throw exception;
    }
  }

  /**
   * Get additional parameters for nunjucks
   * to pass into the template as variables
   *
   * @param config
   * @param args
   *
   * @return {{ [key: string]: string }}
   */
  private static getAdditionalParameters<T>(
    params: { [key: string]: string },
    args: IArguments
  ): { [key: string]: string } {
      const argParams = Object.keys(args).reduce((accu: { [key: string]: string}, item: string) => {
        // Only pull out additional parameter
        // arguments from the cli
        // @todo: Find a cleaner way to get it from the interface?
        if (
            item !== "config" &&
            item !== "templatePath" &&
            item !== "init" &&
            item !== "template" &&
            item !== "dest"
        ) {
            accu[item] = args[item] as string;
        }

        return accu;
      }, {});

      return Object.assign({}, params, argParams);
  }

  /**
   * Attempt to find a __templates__ directory
   * in the root of the project.
   *
   * @return {string} The template file contents
   */
  private static resolveTemplatePath(): string {
    const getDirectories = (source: string) => readdirSync(source).map(name => join(source, name));

    const path = resolve(process.cwd(), "__templates__");
    const foundTemplates = getDirectories(path);

    if (!foundTemplates || foundTemplates.length > 1) {
      throw "Could not find a __templates__ directory, or config file containing templates path.";
    }

    return path;
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
  public static async getTemplateString(templatePath: string, templateName: string): Promise<string> {
    try {
      const templateFile = await Utilities.findTemplate(templatePath, templateName);

      return await templateFile.getContents();
    } catch (exception) {
      throw `
                Could not find the template: ${templatePath}/${templateName}.
                [Error]: ${exception}
            `;
    }
  }
  // #endregion
}
