"use strict";

class Action {
    constructor(fileName) {
        this.fileName = fileName;
    }

    output() {
        return `
const ACTION = "ACTION";

export const action = () => ({
    type: ACTION
});
`
    }
};

module.exports = Action;