import test from "ava";
import File from "../File";

test("Test file contains file name.", (t) => {
    let file = new File("test");
    
    t.true(file.toString().indexOf("test") > 0);
});

