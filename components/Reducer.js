"use strict";

class Reducer {
    constructor(fileName) {
        this.fileName = fileName;
    }

    output() {
        return `
const initialState = {};

export default (state = initialState, action) => {
    switch(action.type) {
        default:
            return state;
    }
}`
    }
};

module.exports = Reducer;