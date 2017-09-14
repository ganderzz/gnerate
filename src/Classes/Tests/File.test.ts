import File from "../File";

jest.mock("fs", () => ({
    existsSync: (filename: string) => {
        if (filename.indexOf("correct") > -1) {
            return true;
        }

        return false;
    },
}));

describe("Testing File Class", () => {
    describe("Testing toString()", () => {
        it("Should create a class containing the file name.", () => {
            const filename = "test.js";
            const file = new File(filename);
    
            expect(file.toString()).toContain(filename);
        });
    });
    
    describe("Testing exists()", () => {
        it("Should find an existing file", () => {
            const filename = "correct.js";
            const file = new File(filename);
    
            expect(file.exists()).toBeTruthy();
        });
    
        it("Should fail on not finding a file", () => {
            const filename = "fail.js";
            const file = new File(filename);
    
            expect(file.exists()).toBeFalsy();
        });
    });
});
