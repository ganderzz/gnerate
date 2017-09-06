import * as fs from "fs";
import * as path from "path";

export default class File {
    public constructor(filename: string) {
        this._filename = path.resolve(filename);
    }

    public exists(): boolean {
        return fs.existsSync(this._filename);
    }

    async getJSONContents(): Promise<{ [key: string]: string }> {
        return new Promise<{ [key: string]: string }>((resolve, reject) =>
            fs.readFile(this._filename, (error: NodeJS.ErrnoException, data: Buffer) => {
                if (error) {
                    reject(error);
                }

                try {
                    resolve(JSON.parse(data.toString()));
                } catch(exception) {
                    reject(exception);
                }
            })
        );
    }

    async getContents(): Promise<string> {
        return new Promise<string>((resolve, reject) =>
            fs.readFile(this._filename, (error: NodeJS.ErrnoException, data: Buffer) => {
                if (error) {
                    reject(error);
                }

                try {
                    resolve(data.toString());
                } catch(exception) {
                    reject(exception);
                }
            })
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