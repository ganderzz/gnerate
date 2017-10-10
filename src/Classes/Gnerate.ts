import { resolve, join } from "path";
import { renderString } from "nunjucks";
import { lstatSync, readdirSync } from "fs";
import Utilities from "./Utilities";
import File from "./File";

import IArguments from "../Interfaces/IArguments";
import IConfig from "../Interfaces/IConfig";
import IAlias from "../Interfaces/IAlias";

export default class Gnerate {
  // #region Static Methods
  /**
   * Show instructions on how to use Gnerate
   */
  public static showManPage() {
    console.log("==========  gnerate  ==========");
    console.log("gnerate --init - Initializes the project with a gnerate config");
    console.log(
      "gnerate [templateName] [destination]  -  Generate a new file from a template to a path relative to the cwd."
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

    if (args.help || args.man) {
      Gnerate.showManPage();

      return;
    }

    if (args.version) {
      const pkg = require("../../package.json");

      console.log(`Gnerate: ${pkg.version}`);
      return;
    }

    if (args.init) {
      console.log("\nGenerating config file..");

      return this.initialize();
    }

    if (!args.template) {
      console.log("\nTemplate name was not provided to gnerate.");

      return;
    }

    if (!args.dest) {
      console.log("\nDestination was not provided to gnerate.");
      
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
      try {
        templatePath = this.resolveTemplatePath();
      } catch (exception) {
        console.log(exception);
        return;
      }
    }

    const params = this.createParameters(
      configContents && configContents.parameters || {},
      args
    );

    if (configContents && configContents.alias && configContents.alias[args.template]) {
      this.generateFromAlias(configContents.alias[args.template], templatePath, params, args.dest);

      return;
    }

    try {
      const template = await Gnerate.getTemplateString(templatePath, args.template);
      
      await this.generateFileFromTemplate(template, params, args.dest);

      console.log(`\n\n\tFile ${args.dest} has been sucessfully generated!\n\n`);
    } catch (exception) {
      console.log(exception.toString());
    }
  }

  /**
   * Create parameters for template, merging user and
   * Gnerate provided params
   * 
   * @param parameters 
   * @param args 
   */
  private static createParameters(parameters: {}, args: IArguments) {
    const fileParts = Utilities.getFileNameAndExtension(args.dest);

    return Object.assign(
      {},
      {
        filename: fileParts[0],
        fileExtension: fileParts[1],
      },
      this.getAdditionalParameters(parameters, args)
    )
  }

  /**
   * Generate file from a template
   * 
   * @param template 
   * @param parameters 
   * @param dest 
   */
  private static async generateFileFromTemplate(template: string, parameters: {}, dest: string) {
    const renderedTemplate = renderString(template, parameters);

    try {
      return await Gnerate.writeToDestination(renderedTemplate, dest);
    } catch (exception) {
      throw `\nCould not write template to (${exception.path})` +
            `\nMaybe invalid permissions, or trying to write over a directory?` +
            `\n\n${exception}`;
    }
  }

  /**
   * Loop through the provided aliases, and generate templates
   * for each one
   * 
   * @param templatesToGenerate 
   * @param templatePath 
   * @param params 
   * @param dest 
   */
  private static generateFromAlias(templatesToGenerate: IAlias, templatePath: string, params: {}, dest: string) {
    const items = Object.keys(templatesToGenerate);
    
    items.forEach(async key => {
      const template = await Gnerate.getTemplateString(templatePath, key);
      const filename = templatesToGenerate[key].filename;
      const fileParts = Utilities.getFileNameAndExtension(filename);
  
      try {
        Gnerate.generateFileFromTemplate(template, params, dest + filename);

        console.log(`\tFile ${dest + filename} has been sucessfully generated!`);
      } catch (exception) {
        console.log(exception.toString());
        return;
      }
    });
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
    return resolve(process.cwd(), "__templates__");
  }

  /**
   * Gets the contents of the gnerate config file
   *
   * @param config
   *
   * @return {Promise<IConfig>}
   */
  public static async getConfigContents(config: string | IConfig = null): Promise<IConfig> {
    try {
      const parsedConfig = typeof config === "string" ?
                              await Utilities.getFileContents(config) :
                              config;
      
      return parsedConfig || null;
    } catch (exception) {
      throw exception;
    }
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
      throw `\n\nCould not find the template: ${templatePath}/${templateName}.` +
            `\nEither the template doesn't exist, or an alias name is missing.`;
    }
  }
  // #endregion
}
