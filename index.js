#!/usr/bin/env node
"use strict";

const minimalist = require("minimist");
const fs = require("fs");

const Types = require("./components/Types");
const Container = require("./components/Container");
const Action = require("./components/Action");
const Component = require("./components/Component");
const Reducer = require("./components/Reducer");


function showManPage() {
    console.log("=====  rgen  =====");
    console.log("container [name]  -  Generate a container with the name");
    console.log("component [name]  -  Generate a component with the name");
}

function generationFactory(type, fileName) {
    switch(type) {
        case Types.CONTAINER:
            return new Container(fileName);
        
        case Types.COMPONENT:
            return new Component(fileName);
        
        case Types.ACTION:
            return new Action(fileName);

        case Types.REDUCER:
            return new Reducer(fileName);

        default:
            throw "Invalid type passed to generate.";
    }
}

if(process.argv.length <= 2) {
    console.log("Missing commands.");
    showManPage();

    return;
}

const args = minimalist(process.argv.slice(2));
const factory = generationFactory(args["_"][0], args["_"][1]);

fs.writeFile(`./${factory.fileName}.js`, factory.output(), function(error) {
    if(error) {
        return console.log("ERROR: ", error);
    }

    console.log("All Good.");
})