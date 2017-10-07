import * as fs from "fs";
import * as path from "path";

export default class File {
  public constructor(filename: string) {
    this._filename = path.resolve(filename);
  }
  
  // #region Public Methods
  /**
     * Check if the file exists
     * 
     * @return {boolean}
     */
  public exists(): boolean {
    return fs.existsSync(this._filename);
  }

  /**
     * Gets the contents of a file, and attempts
     * to parse it as JSON
     * 
     * @return {Promise<T>}
     */
  async getJSONContents<T>(): Promise<T> {
    return this._readFile().then(
      data =>
        new Promise<T>((resolve, reject) => {
          try {
            return resolve(JSON.parse(data.toString()));
          } catch (exception) {
            reject(exception);
          }
        })
    );
  }

  /**
     * Gets the contents of a file
     * 
     * @return {Promise<string>}
     */
  async getContents(): Promise<string> {
    return this._readFile().then(data => new Promise<string>(resolve => resolve(data.toString())));
  }

  /**
     * Write data to the a location
     * 
     * @param data 
     * 
     * @return {Promise<boolean>}
     */
  async writeContents(data: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fs.writeFile(`${this._filename}`, data, (error: NodeJS.ErrnoException) => {
        if (error) {
          reject(error);
        }

        resolve(true);
      });
    });
  }

  /**
   * Returns the filePath/fileName as a string
   */
  public toString(): string {
    return this._filename.toString();
  }
  // #endregion
  // #region Private Methods
  /**
     * Node implementation of reading a file.
     * Both getJSONContents() and getContents() use this
     * as a base method.
     * 
     * @return {Promise<Buffer>}
     */
    private async _readFile(): Promise<Buffer> {
      return new Promise<Buffer>((resolve, reject) =>
        fs.readFile(this._filename, (error: NodeJS.ErrnoException, data: Buffer) => {
          if (error) {
            reject(error);
          }
  
          return resolve(data);
        })
      );
    }
  // #endregion
  // #region Static Methods
  /**
   * Create a directory with a given name
   * 
   * @param directoryName 
   */
  public static createDirectory(directoryName: string) {
    if (!fs.existsSync(directoryName)) {
      fs.mkdirSync(directoryName);
    }
  }
  // #endregion

  // #region Private Methods
  private readonly _filename: string;
  // #endregion
}
