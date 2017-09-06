import * as fs from "fs";
import * as path from "path";

export default class File {
    public constructor(filename: string) {
        this._filename = path.resolve(filename);
    }

    public exists(): boolean {
        return fs.existsSync(this._filename);
    }

    private async readFile(): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) =>
            fs.readFile(this._filename, (error: NodeJS.ErrnoException, data: Buffer) => {
                if (error) {
                    reject(error);
                }

                return resolve(data);
            })
        );
    }

    async getJSONContents(): Promise<{ [key: string]: string }> {
        return this.readFile().then(data =>
            new Promise<{ [key: string]: string }>((resolve, reject) => {
                try {
                    return resolve(JSON.parse(data.toString()));
                } catch(exception) {
                    reject(exception);
                }
            })
        );
    }

    async getContents(): Promise<string> {
        return this.readFile().then(data =>
            new Promise<string>(resolve => resolve(data.toString()))
        );
    }

    async writeContents(filename: string, data: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            fs.writeFile(`${this._filename}/${filename}`, data, (error: NodeJS.ErrnoException) => {
                if (error) {
                    reject(error);
                }

                resolve(true);
            });
        });
    }

    public toString(): string {
        return this._filename.toString();
    }

    private readonly _filename: string;
}