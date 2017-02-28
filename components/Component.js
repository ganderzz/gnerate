"use strict";

class Component {
    constructor(fileName) {
        this.fileName = fileName;
    }

    output() {
        return `import React, { Component } from "react";

export default (props) => {
    return (
        <div>
            Hello.
        </div>
    );
}`
    }
};

module.exports = Component;