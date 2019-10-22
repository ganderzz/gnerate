import Utilities from "../Utilities";
import IArguments from "../../Interfaces/IArguments";
import IFileName from "../../Interfaces/IFileName";

describe("Testing Utilities Class", () => {
    describe("Testing parseArguments", () => {
        it("Should return all arguments", () => {
            const args = [
                "template",
                "path/name",
                "--config=gnerate.config.js",
                "--templatePath=gnerate.template",
                "--init",
                "--version",
                "--help"
            ];

            const argsRes = Utilities.parseArguments(args);

            const expectedArgs: IArguments = {
                template: "template",
                dest: "path/name",
                config: "gnerate.config.js",
                templatePath: "gnerate.template",
                init: true,
                help: true,
                version: true
            };

            expect(argsRes).toMatchObject(expectedArgs);
        });
    });

    describe("Testing getFileNameAndExtension", () => {
        it("Should return filename and extension", () => {
            const fileName = "../test/test.test.template";

            const actualRes = Utilities.getFileNameAndExtension(fileName);

            const expectedRes: IFileName = {
                name: "test.test",
                extension: "template"
            };

            expect(actualRes).toMatchObject(expectedRes);
        });
    });
});