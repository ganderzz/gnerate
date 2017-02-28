"use strict";

class Container {
    constructor(fileName) {
        this.fileName = fileName;
    }

    output() {
        return `import React, { Component } from "react";

export default class ${this.fileName} extends Component {
    render() {
        return (
            <div>
                Hello.
            </div>
        );
    }
}`
    }
};

module.exports = Container;