import * as mock from "mock-fs";
import Gnerate from "../Gnerate";

describe("Testing Gnerate Class", () => {
    describe("Testing showManPage()", () => {
        let log: jest.SpyInstance<any>;

        beforeEach(() => {
            log = jest.spyOn(global.console, "log");
        });

        afterEach(() => {
            log.mockReset();
        });

        afterAll(() => {
            log.mockRestore();
        });

        it("Should write man page to the console", () => {
            Gnerate.showManPage();

            expect(log).toHaveBeenCalled();
        });
    });
});
