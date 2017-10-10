import * as fs from "fs";

import IArguments from "../Interfaces/IArguments";
import IConfig from "../Interfaces/IConfig";
import File from "./File";

export default class Utilities {
  // #region Static Methods
  /**
   * Parses arguments, and returns as a json representation
   * 
   * @param args 
   * 
   * @return {IArguments}
   */
  public static parseArguments(args: string[]): IArguments {
    return args.reduce((accu: IArguments, current: string) => {
      // Parse out options if they exist
      // These will always lead with -- separated by = (--config=./test.config)
      if (current.indexOf("--") > -1) {
        const keyValue = current.split("--")[1].split("=");

        return {
          [keyValue[0]]: keyValue[1] || true,
          ...accu,
        };
      }

      // Assume first non-option value will always be the template name
      if (!accu.template) {
        return {
          template: current,
          ...accu,
        };
      }

      // Assume second non-option value will always be the destination
      if (!accu.dest) {
        return {
          dest: current,
          ...accu,
        };
      }

      return accu;
    }, {}) as IArguments;
  }

  /**
   * Searches the templatePath for a template containing a substring of `templateName`.
   * 
   * If filter = 0 or filter > 1: Reject the promise as we are only looking for one component
   * filter = 1: Get the location of the file and return it
   * 
   * @param templatePath 
   * @param templateName 
   * 
   * @return {Promise<File>}
   */
  public static async findTemplate(templatePath: string, templateName: string): Promise<File> {
    return new Promise<File>((resolve, reject) =>
      fs.readdir(templatePath, (error: NodeJS.ErrnoException, files: string[]) => {
        const foundFile = files.filter(name => name.indexOf(templateName) > -1);

        if (foundFile.length === 0 || foundFile.length > 1) {
          reject(`Could not resolve the template '${templateName}' given at ${templatePath}`);
        }

        resolve(new File(`${templatePath}/${foundFile[0]}`));
      })
    );
  }

  /**
   * Reads in the contents of a file
   * 
   * @param configPath 
   * 
   * @return {string}
   */
  public static async getFileContents(filePath: string): Promise<IConfig> {
    const file = new File(filePath);

    if (!file.exists()) {
      throw `Could not find file: ${filePath}`;
    }

    try {
      return await require(file.toString());
    } catch (exception) {
      console.log(exception.toString())
      throw exception;
    }
  }

  /**
   * Parses out the filename/file extension
   * 
   * @param filename 
   */
  public static getFileNameAndExtension(filename: string): string[] {
    return filename.replace(/^.*[\\\/]/, "").split(".");
  }
  // #endregion
}
